/**
 * A class encapsulating a health pack.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Util = require('./Util').Util;

/**
 * Constructor for a health pack.
 * @param {number} x The starting x-coordinate of the health pack (absolute).
 * @param {number} y The starting y-coordinate of the health pack (absolute).
 */
function HealthPack(x, y) {
  this.x = x;
  this.y = y;
  this.shouldExist = true;
};

HealthPack.PICKUP_DISTANCE = 40;

/**
 * Generates and returns a randomly placed health pack.
 */
HealthPack.generateRandomHealthPack = function() {
  var point = Util.getRandomWorldPoint();
  return new HealthPack(point[0], point[1]);
};

/**
 * Returns true if the given player can pick up this health pack.
 */
HealthPack.prototype.isValidPickup = function(player) {
  return player.health < 10 &&
    Util.getManhattanDistance(this.x, this.y, player.x, player.y) <
    HealthPack.PICKUP_DISTANCE;
};

/**
 * Updates this health pack based on the position of all the players on the
 * server.
 */
HealthPack.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (this.isValidPickup(players[i])) {
      var healAmount = Util.randRange(1, 4);
      players[i].health = Math.min(players[i].health + healAmount, 10);
      this.shouldExist = false;
      return;
    }
  }
};

exports.HealthPack = HealthPack;
