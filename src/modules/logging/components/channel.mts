/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ChannelType } from "discord.js"
import d from "fluent-commands"
import { webhooksTable } from "../../../schema.mjs"
import { channelsMessage } from "../commands/configure.mjs"
import { createWebhook, deleteWebhook } from "../logging.mjs"

export const Channel = d
  .select()
  .channel("logging_channel")
  .channelTypes(ChannelType.GuildText) // TODO: make this work
  .handler(
    async (
      interaction,
      category: typeof webhooksTable.$inferInsert.category,
    ) => {
      if (!interaction.inCachedGuild()) {
        return
      }

      const channel = interaction.channels.first()
      if (
        !channel ||
        !channel.isTextBased() ||
        channel.isDMBased() ||
        channel.isThread()
      ) {
        return
      }

      await deleteWebhook(interaction.guild, category)
      await createWebhook(channel, category)

      await interaction.update(await channelsMessage(interaction.guild))
    },
  )
