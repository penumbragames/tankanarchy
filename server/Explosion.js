/**
 * Stores the state of an explosion on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Entity = require('./Entity');

/**
 * @constructor
 * @param {number} x The x coordinate of the explosion.
 * @param {number} y The y coordinate of the explosion.
 * @param {number} size The size of the explosion in pixels as it should be
 *   rendered on the client.
 * @param {number} duration The duration of the explosion in milliseconds.
 */
function Explosion(x, y, size, duration) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.expires = (new Date()).getTime() + duration;
}
require('./inheritable');
Explosion.inheritsFrom(Entity);

/**
 * DEFAULT_DURATION is in milliseconds.
 */
Explosion.DEFAULT_DURATION = 1000;

/**
 * Returns true if the explosion is expired.
 * @return {boolean}
 */
Explosion.prototype.isExpired = function() {
  return (new Date()).getTime() > this.expires;
};

module.exports = Explosion;
