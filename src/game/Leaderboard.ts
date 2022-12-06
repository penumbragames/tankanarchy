/**
 * This class handles the rendering and updating of the leaderboard.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Player from '../server/Player'

class Leaderboard {
  container:HTMLElement

  constructor(container:HTMLElement) {
    this.container = container
  }

  static create(containerElementID:string) {
    return new Leaderboard(document.getElementById(containerElementID)!)
  }

  /**
   * Updates the leaderboard with the list of current players.
   * @param {Array<Player>} players The list of current players
   */
  update(players:Player[]) {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }
    players.sort((a:Player, b:Player) => b.kills - a.kills)
    players.slice(0, 10).forEach(player => {
      const containercontainer = document.createElement('li')
      const text =
        `${player.name} - Kills: ${player.kills} Deaths: ${player.deaths}`
      containercontainer.appendChild(document.createTextNode(text))
      this.container.appendChild(containercontainer)
    })
  }
}

export default Leaderboard
