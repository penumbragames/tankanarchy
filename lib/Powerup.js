/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');
var Player = require('./Player');
var World = require('./World');

var Util = require('../shared/Util');

/**
 * Constructor for a powerup.
 * @constructor
 * @param {Array.<number>} position The position of the powerup.
 * @param {string} name The name of the powerup.
 * @param {number|string} data Data associated with this powerup.
 * @param {number} duration The duration of the powerup when applied.
 */
function Powerup(position, name, data, duration) {
  this.position = position;
  this.name = name;
  this.data = data;
  this.duration = duration;

  this.shouldExist = true;
}
require('../shared/base');
Powerup.inheritsFrom(Entity);

/**
 * HITBOX_SIZE is in pixels.
 */
Powerup.HITBOX_SIZE = 10;

/**
 * Available Powerup types and specifications.
 */

/**
 * @const
 * @type {Object}
 */
// Powerup.TYPES = [
//   {
//     name: 'healthpack_powerup',
//     modifier: function() {
//       return function(player) {
//         var healAmount = Util.randRangeInt(1, 4);
//         player.health = Math.min(player.health + healAmount);
//       }
//     },
//   }
// ];

/**
 * @const
 * @type {string}
 */
Powerup.HEALTHPACK = 'healthpack_powerup';

/**
 * @const
 * @type {number}
 */
Powerup.HEALTHPACK_MIN_HEAL = 1;

/**
 * @const
 * @type {number}
 */
Powerup.HEALTHPACK_MAX_HEAL = 4;

/**
 * @const
 * @type {string}
 */
Powerup.SHOTGUN = 'shotgun_powerup';

/**
 * @const
 * @type {number}
 */
Powerup.SHOTGUN_MIN_BONUS_SHELLS = 1;

/**
 * @const
 * @type {number}
 */
Powerup.SHOTGUN_MAX_BONUS_SHELLS = 2;

/**
 * @const
 * @type {string}
 */
Powerup.RAPIDFIRE = 'rapidfire_powerup';

/**
 * @const
 * @type {number}
 */
Powerup.RAPIDFIRE_MIN_MULTIPLIER = 2.0;

/**
 * @const
 * @type {number}
 */
Powerup.RAPIDFIRE_MAX_MULTIPLIER = 3.5;

/**
 * @const
 * @type {string}
 */
Powerup.SPEEDBOOST = 'speedboost_powerup';

/**
 * @const
 * @type {number}
 */
Powerup.SPEEDBOOST_MIN_MULTIPLIER = 1.2;

/**
 * @const
 * @type {number}
 */
Powerup.SPEEDBOOST_MAX_MULTIPLIER = 1.8;

/**
 * @const
 * @type {string}
 */
Powerup.SHIELD = 'shield_powerup';

/**
 * @const
 * @type {number}
 */
Powerup.SHIELD_MIN_STRENGTH = 1;

/**
 * @const
 * @type {number}
 */
Powerup.SHIELD_MAX_STRENGTH = 3;

/**
 * @const
 * @type {Array}
 */
Powerup.POWERUPS = [Powerup.HEALTHPACK,
                    Powerup.SHOTGUN,
                    Powerup.RAPIDFIRE,
                    Powerup.SPEEDBOOST,
                    Powerup.SHIELD];

/**
 * @const
 * @type {number}
 */
Powerup.MIN_DURATION = 5000;

/**
 * @const
 * @type {number}
 */
Powerup.MAX_DURATION = 15000;

/**
 * Returns a randomly generated Powerup.
 * @return {Powerup}
 */
Powerup.generateRandomPowerup = function() {
  var point = World.getRandomPoint();
  var name = Util.choiceArray(Powerup.POWERUPS);
  var data = null;
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
                            Powerup.RAPIDFIRE_MAX_MULTIPLIER);
      break;
    case Powerup.SPEEDBOOST:
      data = Util.randRange(Powerup.SPEEDBOOST_MIN_MULTIPLIER,
                            Powerup.SPEEDBOOST_MAX_MULTIPLIER);
      break;
    case Powerup.SHIELD:
      data = Util.randRangeInt(Powerup.SHIELD_MIN_STRENGTH,
                               Powerup.SHIELD_MAX_STRENGTH + 1);
      break;
  }
  var duration = Util.randRange(Powerup.MIN_DURATION,
                                Powerup.MAX_DURATION);
  return new Powerup(point, name, data, duration);
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
 * Updates this health pack based on the position of all the players on the
 * server.
 * @param {Array.<Player>} players An array of currently active players.
 */
Powerup.prototype.update = function(players) {
  for (var i = 0; i < players.length; ++i) {
    if (players[i].isCollidedWith(this.x, this.y,
                                  Powerup.HITBOX_SIZE)) {
      players[i].applyPowerup(this.name, this.getAppliedObject());
      this.shouldExist = false;
      return;
    }
  }
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Powerup;
