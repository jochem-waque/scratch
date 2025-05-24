/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"

export const webhooksTable = sqliteTable(
  "webhooks",
  {
    id: int().primaryKey(),
    guild: text().notNull(),
    channel: text().notNull(),
    category: text({ enum: ["message", "member", "user"] }).notNull(),
  },
  (t) => [unique().on(t.guild, t.category)],
)
