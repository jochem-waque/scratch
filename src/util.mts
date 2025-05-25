/**
 * Copyright (C) 2025  Jochem Waqué
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export function titleCase(text: string) {
  return text.replace(/\b(\w)/g, (char) => char.toUpperCase())
}
