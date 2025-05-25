/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  AnyThreadChannel,
  Guild,
  GuildTextBasedChannel,
  Webhook,
  WebhookType,
} from "discord.js"
import { and, eq } from "drizzle-orm"
import d from "fluent-commands"
import { Database } from "../../index.mjs"
import { webhooksTable } from "../../schema.mjs"
import { Configure } from "./commands/configure.mjs"
import { GuildAvailable } from "./events/guildAvailable.mjs"
import { GuildMemberAdd } from "./events/guildMemberAdd.mjs"
import { GuildMemberRemove } from "./events/guildMemberRemove.mjs"
import { GuildMemberUpdate } from "./events/guildMemberUpdate.mjs"
import { MessageDelete } from "./events/messageDelete.mjs"
import { MessageUpdate } from "./events/messageUpdate.mjs"
import { UserUpdate } from "./events/userUpdate.mjs"

export const Logging = d
  .module("logging")
  .addCommand(Configure)
  .addEventHandler(GuildAvailable)
  .addEventHandler(GuildMemberAdd)
  .addEventHandler(GuildMemberRemove)
  .addEventHandler(GuildMemberUpdate)
  .addEventHandler(MessageUpdate)
  .addEventHandler(MessageDelete)
  .addEventHandler(UserUpdate)

const cache = new Map<string, Webhook<WebhookType.Incoming>>()

export async function getWebhook(
  guild: Guild,
  category: typeof webhooksTable.$inferSelect.category,
) {
  const result = Database.select()
    .from(webhooksTable)
    .where(
      and(
        eq(webhooksTable.guild, guild.id),
        eq(webhooksTable.category, category),
      ),
    )
    .limit(1)
    .get()

  if (!result) {
    return null
  }

  const webhook = cache.get(result.channel)
  if (webhook) {
    return webhook
  }

  await cacheWebhooks(guild)

  const newWebhook = cache.get(result.channel)
  if (newWebhook) {
    return newWebhook
  }

  return null
}

export async function getWebhooks(
  guilds: Guild[],
  category: typeof webhooksTable.$inferSelect.category,
) {
  const webhooks = []
  for (const guild of guilds) {
    const webhook = await getWebhook(guild, category)
    if (webhook) {
      webhooks.push(webhook)
    }
  }
  return webhooks
}

async function cacheWebhooks(guild: Guild) {
  const webhooks = await guild.fetchWebhooks()

  for (const webhook of webhooks.values()) {
    if (!webhook.isIncoming()) {
      continue
    }

    if (webhook.owner?.id !== guild.client.user.id) {
      continue
    }

    cache.set(webhook.channelId, webhook)
  }
}

export async function deleteWebhook(
  guild: Guild,
  category: typeof webhooksTable.$inferSelect.category,
) {
  const webhook = await getWebhook(guild, category)

  Database.delete(webhooksTable)
    .where(
      and(
        eq(webhooksTable.guild, guild.id),
        eq(webhooksTable.category, category),
      ),
    )
    .run()

  await webhook?.delete()
}

export async function createWebhook(
  channel: Exclude<GuildTextBasedChannel, AnyThreadChannel>,
  category: typeof webhooksTable.$inferInsert.category,
) {
  const webhook = await channel.createWebhook({ name: "Logging" })

  Database.insert(webhooksTable)
    .values({ guild: channel.guildId, channel: channel.id, category })
    .run()

  cache.set(channel.id, webhook)

  return webhook
}
