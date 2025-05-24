/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import d from "fluent-commands"

export const GuildAvailable = d
  .event("guildAvailable")
  .once()
  .handler(async (guild) => {
    await guild.members.fetch()

    console.log("Finished fetching members for", guild.name)
  })
