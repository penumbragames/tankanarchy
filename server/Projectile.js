/**
 * This is a wrapper class for projectiles on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for a projectile.
 */
function Projectile(x, y, direction, source) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.source = source;
}

module.exports = Projectile;
