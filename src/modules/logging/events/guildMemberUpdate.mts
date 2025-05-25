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
  userMention,
} from "discord.js"
import d from "fluent-commands"
import { getWebhook } from "../logging.mjs"

export const GuildMemberUpdate = d
  .event("guildMemberUpdate")
  .handler(async (oldMember, newMember) => {
    if (oldMember.partial) {
      return
    }

    const webhook = await getWebhook(newMember.guild, "member")
    if (!webhook) {
      return
    }

    const changes = []

    if (oldMember.nickname !== newMember.nickname) {
      changes.push(
        d.separator(),
        d.text(heading("Nickname changed", HeadingLevel.Two)),
        d.text(heading("Before", HeadingLevel.Three)),
        oldMember.nickname ? d.text(oldMember.nickname) : d.text("None"),
        d.text(heading("After", HeadingLevel.Three)),
        newMember.nickname ? d.text(newMember.nickname) : d.text("None"),
      )
    }

    const oldAvatar = oldMember.avatarURL()
    const newAvatar = newMember.avatarURL()
    if (oldAvatar !== newAvatar) {
      changes.push(
        d.separator(),
        d.text(heading("Avatar changed", HeadingLevel.Two)),
        d.text(heading("Before", HeadingLevel.Three)),
        oldAvatar ? d.gallery(d.media(oldAvatar)) : d.text("None"),
        d.text(heading("After", HeadingLevel.Three)),
        newAvatar ? d.gallery(d.media(newAvatar)) : d.text("None"),
      )
    }

    const oldBanner = oldMember.bannerURL()
    const newBanner = newMember.bannerURL()
    if (oldBanner !== newBanner) {
      changes.push(
        d.separator(),
        d.text(heading("Banner changed", HeadingLevel.Two)),
        d.text(heading("Before", HeadingLevel.Three)),
        oldBanner ? d.gallery(d.media(oldBanner)) : d.text("None"),
        d.text(heading("After", HeadingLevel.Three)),
        newBanner ? d.gallery(d.media(newBanner)) : d.text("None"),
      )
    }

    if (changes.length === 0) {
      console.log(oldMember, newMember)
      return
    }

    await webhook.send({
      username: newMember.client.user.displayName,
      avatarURL: newMember.client.user.displayAvatarURL(),
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
      components: [
        d
          .container(
            d.text(heading("Member updated")),
            d.section(
              d.text(heading("Member", HeadingLevel.Two)),
              d.text(`${newMember.displayName}\n${userMention(newMember.id)}`),
              d.text(newMember.id),
              d.thumbnail(newMember.displayAvatarURL()),
            ),
            ...changes,
          )
          .accent(Colors.Orange)
          .build(),
      ],
    })
  })
