/**
 * Stores the state of a bullet on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Projectile = require('./Projectile');
var Util = require('./Util');

/**
 * Constructor for a bullet.
 * @constructor
 * @param {number} x The starting x-coordinate of the bullet (absolute).
 * @param {number} y The starting y-coordinate of the bullet (absolute).
 * @param {number} direction The direction the bullet will travel in
 *   radians.
 * @param {string} source The socket ID of the player that fired the
 *   bullet.
 * @extends Projectile
 */
function Bullet(x, y, direction, source) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.source = source;
  this.damage = Bullet.DEFAULT_DAMAGE;

  this.lastUpdateTime = (new Date()).getTime();
  this.distanceTraveled = 0;
  this.shouldExist = true;
}
require('./inheritable');
Bullet.inheritsFrom(Projectile);

/**
 * VELOCITY is in pixels per millisecond.
 * DEFAULT_DAMAGE is in health points.
 * MAX_TRAVEL_DISTANCE is in pixels.
 * HITBOX_SIZE is in pixels and represents a radius around the bullet entity.
 */
Bullet.VELOCITY = 1;
Bullet.DEFAULT_DAMAGE = 1;
Bullet.MAX_TRAVEL_DISTANCE = 1000;
Bullet.HITBOX_SIZE = 10;

/**
 * Updates this bullet and checks for collision with any player.
 * We reverse the coordinate system and apply sin(direction) to x because
 * canvas in HTML will use up as its '0' reference point while JS math uses
 * left as its '0' reference point.
 * this.direction always is stored in radians.
 * @param {Hashmap} clients The Hashmap of active IDs and players stored on
 *   the server.
 */
Bullet.prototype.update = function(clients) {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - this.lastUpdateTime;
  this.x += Bullet.VELOCITY * Math.sin(this.direction) * timeDifference;
  this.y -= Bullet.VELOCITY * Math.cos(this.direction) * timeDifference;
  this.distanceTraveled += Bullet.VELOCITY * timeDifference;

  if (this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE ||
      !Util.inWorld(this.x, this.y)) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.source != players[i].id &&
        players[i].isCollidedWith(this.x, this.y,
                                  Bullet.HITBOX_SIZE)) {
      players[i].damage(1);
      if (players[i].isDead()) {
        players[i].respawn();
        var killingPlayer = clients.get(this.source);
        killingPlayer.score++;
      }
      this.shouldExist = false;
      return;
    }
  }

  this.lastUpdateTime = currentTime;
};

module.exports = Bullet;
