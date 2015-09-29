/**
 * This class handles the rendering and updating of the leaderboard.
 * @authro Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the Leaderboard object.
 * @constructor
 * @param {Element} The container element of the leaderboard.
 */
function Leaderboard(element) {
  this.element = element;

  this.players = null;
}

/**
 * Updates the leaderboard.
 * @param {Array.<Object>} players A sorted array of the top ten players.
 */
Leaderboard.prototype.update = function(players) {
  this.players = players;
  console.log(players);

  this.element.empty();
  for (var i = 0; i < this.players.length; ++i) {
    this.element.append($('<li>').text(
      this.players[i].name + " - Kills: " + this.players[i].kills +
      " Deaths: " + this.players[i].deaths));
  };
};
