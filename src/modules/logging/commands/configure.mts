/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ChannelType,
  Guild,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js"
import d from "fluent-commands"
import { webhooksTable } from "../../../schema.mjs"
import { createWebhook, deleteWebhook } from "../../../util/webhooks.mjs"

export const Configure = d
  .slashCommand("log", "Commands related to logging")
  .defaultMemberPermissions(PermissionFlagsBits.Administrator)

  .subcommands({
    messages: d
      .subcommand("Configure logging for changes to messages")
      .options({
        channel: d
          .option("Logging channel")
          .channel()
          .channelTypes(ChannelType.GuildText),
      })
      .handler(async (interaction, { channel }) => {
        if (!interaction.inCachedGuild()) {
          return
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        await updateWebhook(interaction.guild, channel, "message")

        await interaction.editReply({
          content: "TODO",
        })
      }),
    members: d
      .subcommand("Configure logging for changes to members")
      .options({
        channel: d
          .option("Logging channel")
          .channel()
          .channelTypes(ChannelType.GuildText),
      })
      .handler(async (interaction, { channel }) => {
        if (!interaction.inCachedGuild()) {
          return
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        await updateWebhook(interaction.guild, channel, "member")

        await interaction.editReply({
          content: "TODO",
        })
      }),
  })

async function updateWebhook(
  guild: Guild,
  channel: Parameters<typeof createWebhook>[0] | undefined,
  category: typeof webhooksTable.$inferInsert.category,
) {
  await deleteWebhook(guild, category)

  if (!channel) {
    return
  }

  await createWebhook(channel, category)
}
