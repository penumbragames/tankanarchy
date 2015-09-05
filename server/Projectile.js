/**
 * This is a wrapper class for projectiles on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

// Needed for class inheritance.
var Entity = require('./Entity');
var Util = require('./Util');

/**
 * Constructor for a projectile.
 */
function Projectile(x, y, direction, source) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.source = source;
}
Projectile.inheritsFrom(Entity);

module.exports = Projectile;
