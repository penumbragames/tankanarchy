/**
 * A class encapsulating the state of a powerup on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Util = require('./Util').Util;

/**
 * Constructor for a powerup.
 * @param {number} x The x-coordinate of the powerup.
 * @param {number} y The y-coordinate of the powerup.
 * @param {string} name The name of the powerup.
 * @param {number|string} data Data associated with this powerup.
 * @param {number} The duration of the powerup when applied.
 */
function Powerup(x, y, name, data, duration) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.data = data;
  this.duration = duration;
  
  this.shouldExist = true;
};

/**
 * PICKUP_DISTANCE is in pixels.
 */
Powerup.PICKUP_DISTANCE = 30;
Powerup.SHOTGUN = 'shotgun';

Powerup.generateRandomPowerup = function() {
};

/**
 * Returns an object to apply to a player when this powerup is picked up.
 * @return {Object}
 */
Powerup.prototype.getAppliedObject = function() {
  return {
    data: this.data,
    expirationTime: (new Date()).getTime() + this.duration
  };
};

/**
 * Returns true if the given player can pick up this health pack.
 * We square the pickup distance to avoid doing a square root operation whe
 * calculating the distance.
 * @return {boolean}
 */
Powerup.prototype.isValidPickup = function(player) {
  return Util.getEuclideanDistance2(this.x, this.y, player.x, player.y) <
    (Powerup.PICKUP_DISTANCE * HealthPack.PICKUP_DISTANCE);
};

/**
 * Updates this health pack based on the position of all the players on the
 * server.
 * @param {[Player]} players An array of currently active players.
 */
Powerup.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (this.isValidPickup(players[i])) {
      /**
       **/
      this.shouldExist = false;
      return;
    }
  }
};

exports.Powerup = Powerup;
