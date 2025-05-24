/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import d from "fluent-commands"
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
