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
  WebhookMessageCreateOptions,
} from "discord.js"
import d from "fluent-commands"
import { getWebhooks } from "../logging.mjs"

export const UserUpdate = d
  .event("userUpdate")
  .handler(async (oldUser, newUser) => {
    if (oldUser.partial) {
      return
    }

    const guilds = []
    for (const guild of newUser.client.guilds.cache.values()) {
      if (guild.members.cache.has(newUser.id)) {
        guilds.push(guild)
      }
    }

    const webhooks = await getWebhooks(guilds, "user")
    if (webhooks.length === 0) {
      return
    }

    const changes = []

    if (oldUser.tag !== newUser.tag) {
      changes.push(
        d.separator(),
        d.text(heading("Username changed", HeadingLevel.Two)),
        d.text(heading("Before", HeadingLevel.Three)),
        d.text(oldUser.tag),
        d.text(heading("After", HeadingLevel.Three)),
        d.text(newUser.tag),
      )
    }

    if (oldUser.globalName !== newUser.globalName) {
      changes.push(
        d.separator(),
        d.text(heading("Display name changed", HeadingLevel.Two)),
        d.text(heading("Before", HeadingLevel.Three)),
        oldUser.globalName ? d.text(oldUser.globalName) : d.text("None"),
        d.text(heading("After", HeadingLevel.Three)),
        newUser.globalName ? d.text(newUser.globalName) : d.text("None"),
      )
    }

    const oldAvatar = oldUser.avatarURL()
    const newAvatar = newUser.avatarURL()
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

    const oldBanner = oldUser.bannerURL()
    const newBanner = newUser.bannerURL()
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
      console.log(oldUser, newUser)
      return
    }

    const payload: WebhookMessageCreateOptions = {
      username: newUser.client.user.displayName,
      avatarURL: newUser.client.user.displayAvatarURL(),
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
      components: [
        d
          .container(
            d.text(heading("User updated")),
            d.section(
              d.text(newUser.displayName),
              d.text(userMention(newUser.id)),
              d.text(newUser.id),
              d.thumbnail(newUser.displayAvatarURL()),
            ),
            ...changes,
          )
          .accent(Colors.Orange)
          .build(),
      ],
    }

    for (const webhook of webhooks) {
      await webhook.send(payload)
    }
  })
