/**
 * Stores the state of a bullet on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Util = require('./Util');

/**
 * Constructor for a bullet.
 * @param {number} x The starting x-coordinate of the bullet (absolute).
 * @param {number} y The starting y-coordinate of the bullet (absolute).
 * @param {number} direction The direction the bullet will travel in
 *   radians.
 * @param {string} firedBy The socket ID of the client that fired the
 *   bullet.
 * @constructor
 */
function Bullet(x, y, direction, firedBy) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.firedBy = firedBy;
  this.damage = Bullet.DEFAULT_DAMAGE;

  this.distanceTraveled = 0;
  this.shouldExist = true;

  return this;
};

/**
 * VELOCITY is in pixels per update.
 * MAX_TRAVEL_DISTANCE is in pixels.
 * HITBOX_SIZE is in pixels.
 */
Bullet.VELOCITY = 20;
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
  this.x += Bullet.VELOCITY * Math.sin(this.direction);
  this.y -= Bullet.VELOCITY * Math.cos(this.direction);
  this.distanceTraveled += Bullet.VELOCITY;

  if (this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE ||
      !Util.inWorld(this.x, this.y)) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.firedBy != players[i].id &&
        players[i].isCollidedWith(this.x, this.y,
                                  Bullet.HITBOX_SIZE)) {
      players[i].damage(1);
      if (players[i].isDead()) {
        players[i].respawn();
        var killingPlayer = clients.get(this.firedBy);
        killingPlayer.score++;
      }
      this.shouldExist = false;
      return;
    }
  }
};

module.exports = Bullet;
