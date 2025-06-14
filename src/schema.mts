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
    category: text({ enum: ["message", "member", "user"] }).notNull(),
    webhookId: text("webhook_id").notNull().unique(),
  },
  (t) => [unique().on(t.guild, t.category)],
)

export const actionLogsTable = sqliteTable("action_log", {
  id: int().primaryKey(),
  guild: text().notNull(),
  reason: text().notNull(),
  type: text({ enum: ["warn", "kick", "ban", "timeout"] }).notNull(),
  dm: int({ mode: "boolean" }).notNull(),
  dmSuccess: int("dm_success", { mode: "boolean" }),
  success: int("success", { mode: "boolean" }),
  by: text().notNull(),
  target: text().notNull(),
})

// export const actionAttachmentsTable = sqliteTable(
//   "action_attachment",
//   {
//     id: int().primaryKey(),
//     action: int()
//       .notNull()
//       .references(() => actionLogsTable.id),
//     url: text().notNull(),
//   },
//   (t) => [unique().on(t.action, t.url)],
// )
