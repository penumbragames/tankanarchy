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

/**
 * Available Powerup types and specifications.
 */
Powerup.HEALTHPACK = 'healthpack';
Powerup.HEALTHPACK_MIN_HEAL = 1;
Powerup.HEALTHPACK_MAX_HEAL = 4;
Powerup.SHOTGUN = 'shotgun';
Powerup.SHOTGUN_MIN_BONUS_SHELLS = 1;
Powerup.SHOTGUN_MAX_BONUS_SHELLS = 2;
Powerup.RAPIDFIRE = 'rapidfire';
Powerup.RAPIDFIRE_MIN_MULTIPLIER = 1.5;
Powerup.RAPIDFIRE_MAX_MULTIPLIER = 4;
Powerup.SPEEDBOOST = 'speedboost';
Powerup.SPEEDBOOST_MIN_BOOST = 1.5;
Powerup.SPEEDBOST_MAX_BOOST = 3.0;
Powerup.POWERUPS = [Powerup.HEALTHPACK,
                    Powerup.SHOTGUN,
                    Powerup.RAPIDFIRE,
                    Powerup.SPEEDBOOST];

/**
 * Returns a randomly generated Powerup.
 * @return {Powerup}
 */
Powerup.generateRandomPowerup = function() {
  var point = Util.getRandomWorldPoint();
  var name = Util.choiceArray(Powerup.POWERUPS);
  var data;
  switch (name) {
    case Powerup.HEALTHPACK:
      data = Util.randRangeInt(Powerup.HEALTHPACK_MIN_HEAL,
                               Powerup.HEALTHPACK_MAX_HEAL + 1);
      break;
    case Powerup.SHOTGUN:
      data = Util.randRangeInt(Powerup.SHOTGUN_MIN_BONUS_SHELLS,
                               Powerup.SHOTGUN_MAX_BONUS_SHELLS + 1);
      break;
    case Powerup.RAPIDFIRE:
      data = Util.randRange(Powerup.RAPIDFIRE_MIN_MULTIPLIER,
                            Powerup.RAPIDFIRE_MAX_MULTIPLIER + 1);
      break;
    case Powerup.SPEEDBOOST:
      data = Util.randRange(Powerup.SPEEDBOOST_MIN_BOOST,
                            Powerup.SPEEDBOST_MAX_BOOST + 1);
      break;
  }
  var duration = Util.randRange(5000, 20000);
  return new Powerup(point[0], point[1], name, data, duration);
};

/**
 * Returns an object to apply to a player when this powerup is picked up.
 * @return {Object}
 */
Powerup.prototype.getAppliedObject = function() {
  return {
    name: this.name,
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
    (Powerup.PICKUP_DISTANCE * Powerup.PICKUP_DISTANCE);
};

/**
 * Updates this health pack based on the position of all the players on the
 * server.
 * @param {[Player]} players An array of currently active players.
 */
Powerup.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (this.isValidPickup(players[i])) {
      players[i].applyPowerup(this.name, this.getAppliedObject());
      this.shouldExist = false;
      return;
    }
  }
};

exports.Powerup = Powerup;
