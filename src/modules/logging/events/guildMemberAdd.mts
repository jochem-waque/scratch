/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  Colors,
  heading,
  HeadingLevel,
  MessageFlags,
  time,
  TimestampStyles,
  userMention,
} from "discord.js"
import d from "fluent-commands"
import { getWebhook } from "../logging.mjs"

export const GuildMemberAdd = d
  .event("guildMemberAdd")
  .handler(async (member) => {
    const webhook = await getWebhook(member.guild, "member")
    if (!webhook) {
      return
    }

    const banner = []
    const bannerUrl = member.displayBannerURL()
    if (bannerUrl) {
      banner.push(d.gallery(d.media(bannerUrl)))
    }

    await webhook.send({
      username: member.client.user.displayName,
      avatarURL: member.client.user.displayAvatarURL(),
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
      components: [
        d
          .container(
            d.section(
              d.text(heading("Member joined")),
              d.text(`${member.displayName}\n${userMention(member.id)}`),
              d.text(member.id),
              d.thumbnail(member.displayAvatarURL()),
            ),
            d.text(heading("Account created at", HeadingLevel.Two)),
            d.text(time(member.user.createdAt, TimestampStyles.LongDateTime)),
            ...banner,
          )
          .accent(Colors.Green)
          .build(),
      ],
    })
  })
