/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { GatewayIntentBits, Partials } from "discord.js"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import d from "fluent-commands"
import { General } from "./modules/general/general.mjs"
import { Logging } from "./modules/logging/logging.mjs"
import { Env } from "./variables.mjs"

export const Database = drizzle(Env.dbFileName)

migrate(Database, { migrationsFolder: "./drizzle" })

const bot = d
  .bot({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.User,
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.Reaction,
      Partials.GuildScheduledEvent,
      Partials.ThreadMember,
      Partials.SoundboardSound,
    ],
  })
  .addModule(General)
  .register()

if (Env.enableLogging) {
  bot.addModule(Logging)
}

await bot.client.login(Env.botToken)
