/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  ButtonStyle,
  channelMention,
  Colors,
  heading,
  HeadingLevel,
  MessageFlags,
  userMention,
} from "discord.js"
import d from "fluent-commands"
import { getWebhook } from "../logging.mjs"

export const MessageUpdate = d
  .event("messageUpdate")
  .handler(async (oldMessage, newMessage) => {
    if (newMessage.author?.bot !== false || !newMessage.inGuild()) {
      return
    }

    const webhook = await getWebhook(newMessage.guild, "message")
    if (!webhook) {
      return
    }

    const author = newMessage.member ?? newMessage.author

    const attachments = []
    if (newMessage.attachments.size > 0) {
      attachments.push(
        d.text(heading("Attachments", HeadingLevel.Two)),
        d.gallery(
          ...newMessage.attachments.map((value) =>
            value.description
              ? d.media(value.url).description(value.description)
              : d.media(value.url),
          ),
        ),
      )
    }

    await webhook.send({
      username: newMessage.client.user.displayName,
      avatarURL: newMessage.client.user.displayAvatarURL(),
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
      components: [
        d
          .container(
            d.text(heading("Message edited")),
            d.text(heading("Author", HeadingLevel.Two)),
            d.section(
              d.text(author.displayName),
              d.text(userMention(author.id)),
              d.text(author.id),
              d.thumbnail(author.displayAvatarURL()),
            ),
            d.text(heading("Channel", HeadingLevel.Two)),
            d.text(channelMention(newMessage.channel.id)),
            d.text(heading("Before", HeadingLevel.Two)),
            d.text((oldMessage.content ?? "Not cached") || "Empty"),
            d.text(heading("After", HeadingLevel.Two)),
            d.text(newMessage.content || "Empty"),
            ...attachments,
            d.row(
              d
                .button(ButtonStyle.Link)
                .label("Jump to message")
                .url(new URL(newMessage.url)),
            ),
          )
          .accent(Colors.Orange)
          .build(),
      ],
    })
  })
