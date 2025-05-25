/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  Colors,
  HeadingLevel,
  MessageFlags,
  TimestampStyles,
  heading,
  roleMention,
  time,
  unorderedList,
  userMention,
} from "discord.js"
import d from "fluent-commands"
import { getWebhook } from "../logging.mjs"

export const GuildMemberRemove = d
  .event("guildMemberRemove")
  .handler(async (member) => {
    const webhook = await getWebhook(member.guild, "member")
    if (!webhook) {
      return
    }

    const joinedAt = []
    if (member.joinedAt) {
      joinedAt.push(
        d.text(heading("Joined at", HeadingLevel.Two)),
        d.text(time(member.joinedAt, TimestampStyles.LongDateTime)),
      )
    }

    const filteredRoles = member.roles.cache.filter(
      (role) => role.id !== role.guild.roles.everyone.id,
    )

    const roles = []
    if (filteredRoles.size > 0) {
      roles.push(
        d.text(heading("Roles", HeadingLevel.Two)),
        d.text(
          unorderedList(filteredRoles.map((role) => roleMention(role.id))),
        ),
      )
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
              d.text(heading("Member left")),
              d.text(`${member.displayName}\n${userMention(member.id)}`),
              d.text(member.id),
              d.thumbnail(member.displayAvatarURL()),
            ),
            ...joinedAt,
            ...roles,
            ...banner,
          )
          .accent(Colors.Red)
          .build(),
      ],
    })
  })
