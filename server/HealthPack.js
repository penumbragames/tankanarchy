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
  this.x_ = x;
  this.y_ = y;
  this.shouldExist_ = true;
};

HealthPack.PICKUP_DISTANCE = 40;

HealthPack.generateRandomHealthPack = function() {
  return new HealthPack(Math.floor(Math.random() * 2441) + 30,
                        Math.floor(Math.random() * 2441) + 30);
};

HealthPack.prototype.isValidPickup = function(player) {
  return player.health_ < 10 &&
    Math.abs(player.x_ - this.x_) + Math.abs(player.y_ - this.y_) <
    HealthPack.PICKUP_DISTANCE;
};

HealthPack.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (this.isValidPickup(players[i])) {
      players[i].health_ = Math.min(players[i].health_ + 2, 10);
      this.shouldExist_ = false;
      return;
    }
  }
};

HealthPack.prototype.shouldExist = function() {
  return this.shouldExist_;
};

exports.HealthPack = HealthPack;
