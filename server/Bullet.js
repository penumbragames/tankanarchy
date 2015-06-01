/**
 * Stores the state of a bullet on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Util = require('./Util');

/**
 * Constructor for a bullet.
 * @constructor
 * @param {number} x The starting x-coordinate of the bullet (absolute).
 * @param {number} y The starting y-coordinate of the bullet (absolute).
 * @param {number} direction The direction the bullet will travel in
 *   radians.
 * @param {string} firedBy The socket ID of the client that fired the
 *   bullet.
 */
function Bullet(x, y, direction, firedBy) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.firedBy = firedBy;

  this.distanceTraveled = 0;
  this.shouldExist = true;

  return this;
};

/**
 * VELOCITY is in pixels per update.
 * MAX_TRAVEL_DISTANCE is in pixels.
 * COLLISION_DISTANCE is in pixels.
 */
Bullet.VELOCITY = 20;
Bullet.MAX_TRAVEL_DISTANCE = 1000;
Bullet.COLLISION_DISTANCE = 30;

/**
 * Returns true if this bullet has collided with the given player.
 * We square the collision distance to avoid using any square roots
 * for the distance formula.
 * @param {Object} player The player to check collision against.
 * @return {boolean}
 */
Bullet.prototype.hit = function(player) {
  return Util.getEuclideanDistance2(this.x, this.y, player.x, player.y) <
    (Bullet.COLLISION_DISTANCE * Bullet.COLLISION_DISTANCE);
};

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
    if (this.firedBy != players[i].id && this.hit(players[i])) {
      players[i].health -= 1;
      if (players[i].health <= 0) {
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
