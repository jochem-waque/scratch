/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ApplicationIntegrationType,
  Guild,
  heading,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js"
import d from "fluent-commands"
import { webhooksTable } from "../../../schema.mjs"
import { titleCase } from "../../../util.mjs"
import { Channel } from "../components/channel.mjs"
import { getWebhook } from "../logging.mjs"

export const Configure = d
  .slashCommand("log", "Commands related to logging")
  .defaultMemberPermissions(PermissionFlagsBits.Administrator)
  .integrationTypes(ApplicationIntegrationType.GuildInstall)
  .contexts(InteractionContextType.Guild)
  .subcommands({
    channels: d
      .subcommand("Configure logging channels")
      .handler(async (interaction) => {
        if (!interaction.inCachedGuild()) {
          return
        }

        await interaction.reply(await channelsMessage(interaction.guild))
      }),
  })

export async function channelsMessage(guild: Guild) {
  const channels: Partial<
    Record<typeof webhooksTable.$inferInsert.category, string>
  > = {}

  for (const category of webhooksTable.category.enumValues) {
    const webhook = await getWebhook(guild, category)
    if (webhook) {
      channels[category] = webhook.channelId
    }
  }

  return {
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
    components: [
      d
        .container(
          d.text(heading("Logging channels")),
          ...webhooksTable.category.enumValues.flatMap((category) => [
            d.text(heading(titleCase(`${category}s`))),
            d.row(
              Channel.with(category).setDefaultChannels(
                channels[category] ? [channels[category]] : [],
              ),
            ),
          ]),
        )
        .build(),
    ],
  }
}
