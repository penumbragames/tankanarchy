/**
 * Wrapper class for all entities on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Constants = require('./Constants');
var Util = require('./Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {number} x The x coordinate of the entity.
 * @param {number} y The y coordinate of the entity.
 */
function Entity(x, y) {
  this.x = x;
  this.y = y;
};

/**
 * Returns true if this entity is visible to the given player.
 * @param {Player} player The player to check visibility to.
 */
Entity.prototype.isVisibleTo = function(player) {
  return Util.inBound(
      this.x,
      player.x - Constants.VISIBILITY_THRESHOLD_X,
      player.x + Constants.VISIBILITY_THRESHOLD_X) && Util.inBound(
      this.y,
      player.y - Constants.VISIBILITY_THRESHOLD_Y,
      player.y + Constants.VISIBILITY_THRESHOLD_Y);
};

module.exports = Entity;
