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

export const MessageDelete = d
  .event("messageDelete")
  .handler(async (message) => {
    if (message.author?.bot !== false || !message.inGuild()) {
      return
    }

    const webhook = await getWebhook(message.guild, "message")
    if (!webhook) {
      return
    }

    const author = message.member ?? message.author

    const attachments = []
    if (message.attachments.size > 0) {
      attachments.push(
        d.text(heading("Attachments", HeadingLevel.Two)),
        d.gallery(
          ...message.attachments.map((value) =>
            value.description
              ? d.media(value.url).description(value.description)
              : d.media(value.url),
          ),
        ),
      )
    }

    await webhook.send({
      username: message.client.user.displayName,
      avatarURL: message.client.user.displayAvatarURL(),
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {},
      components: [
        d
          .container(
            d.text(heading("Message deleted")),
            d.text(heading("Author", HeadingLevel.Two)),
            d.section(
              d.text(author.displayName),
              d.text(userMention(author.id)),
              d.text(author.id),
              d.thumbnail(author.displayAvatarURL()),
            ),
            d.text(heading("Channel", HeadingLevel.Two)),
            d.text(channelMention(message.channel.id)),
            d.text(heading("Content", HeadingLevel.Two)),
            d.text((message.content ?? "Not cached") || "Empty"),
            ...attachments,
            d.row(
              d
                .button(ButtonStyle.Link)
                .label("Jump to message")
                .url(new URL(message.url)),
            ),
          )
          .accent(Colors.Red)
          .build(),
      ],
    })
  })
