/**
 * This class handles the rendering and updating of the leaderboard.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Player from 'lib/game/entity/player/Player'

class LeaderboardEntry {
  player: string
  kills: number
  deaths: number
  // Unused so far
  killstreak: number

  constructor(
    player: string,
    kills: number,
    deaths: number,
    killstreak: number,
  ) {
    this.player = player
    this.kills = kills
    this.deaths = deaths
    this.killstreak = killstreak
  }

  static fromPlayer(player: Player) {
    return new LeaderboardEntry(player.name, player.kills, player.deaths, 0)
  }

  equals(other: LeaderboardEntry): boolean {
    return (
      this.player === other.player &&
      this.kills === other.kills &&
      this.deaths === other.deaths &&
      this.killstreak === other.killstreak
    )
  }
}

export default class Leaderboard {
  container: HTMLElement
  currentLeaderboard: LeaderboardEntry[]

  constructor(container: HTMLElement) {
    this.container = container
    this.currentLeaderboard = []
  }

  static create(containerElementID: string): Leaderboard {
    return new Leaderboard(document.getElementById(containerElementID)!)
  }

  /**
   * Updates the leaderboard with the list of current players. Only refreshes
   * the DOM if the leaderboard changes.
   * @param {Player[]} players The list of current players
   */
  update(players: Player[]): void {
    players.sort((a: Player, b: Player) => b.kills - a.kills)

    const newLeaderboard = players
      .filter((player) => {
        return player.kills > 0
      })
      .slice(0, 5)
      .map((player) => {
        return LeaderboardEntry.fromPlayer(player)
      })
    let differs = false
    if (this.currentLeaderboard.length !== newLeaderboard.length) {
      differs = true
    } else {
      for (let i = 0; i < newLeaderboard.length; ++i) {
        if (!this.currentLeaderboard[i].equals(newLeaderboard[i])) {
          differs = true
          break
        }
      }
    }
    if (differs) {
      this.currentLeaderboard = newLeaderboard
      this.container.replaceChildren()
      for (const entry of this.currentLeaderboard) {
        const containercontainer = document.createElement('li')
        const kdtext = `Kills: ${entry.kills} Deaths: ${entry.deaths}`
        const text = `${entry.player} - ${kdtext}`
        containercontainer.appendChild(document.createTextNode(text))
        this.container.appendChild(containercontainer)
      }
    }
  }
}
