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

Leaderboard.prototype.update = function(players) {
  this.players = players;
  console.log(players);

  // Updates the leaderboard.
  this.players.sort(function(p1, p2) {
    return p2.score > p1.score;
  });
  this.element.empty();
  for (var i = 0; i < Math.min(this.players.length, 10); ++i) {
    this.element.append($('<li>').text(
      this.players[i].name + ": " + this.players[i].score))
  };
};
