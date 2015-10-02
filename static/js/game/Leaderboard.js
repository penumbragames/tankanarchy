/**
 * This class handles the rendering and updating of the leaderboard.
 * @authro Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the Leaderboard object.
 * @constructor
 * @param {Element} The container element of the leaderboard. This
 *   element should be an unordered list.
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

  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }

  for (var i = 0; i < this.players.length; ++i) {
    var playerElement = document.createElement('li');
    playerElement.appendChild(document.createTextNode(
      this.players[i].name + " - Kills: " + this.players[i].kills +
      " Deaths: " + this.players[i].deaths));
    this.element.appendChild(playerElement);
  };
};
