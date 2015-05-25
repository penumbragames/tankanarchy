/**
 * A class encapsulating a health pack.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

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

HealthPack.generateRandomHealthPack = function() {
  return new HealthPack(Math.floor(Math.random() * 2441) + 30,
                        Math.floor(Math.random() * 2441) + 30);
};

HealthPack.prototype.isValidPickup = function(player) {
  return player.health < 10 &&
    Math.abs(player.x - this.x) + Math.abs(player.y - this.y) <
    HealthPack.PICKUP_DISTANCE;
};

HealthPack.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (this.isValidPickup(players[i])) {
      players[i].health = Math.min(players[i].health + 2, 10);
      this.shouldExist = false;
      return;
    }
  }
};

exports.HealthPack = HealthPack;
