/**
 * Stores the state of a bullet on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Util = require('./Util').Util;
var Constants = require('./Constants').Constants;

/**
 * Constructor for a bullet.
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
};

Bullet.VELOCITY = 20;
Bullet.TRAVEL_DISTANCE = 800;
Bullet.COLLISION_DISTANCE = 25;

/**
 * Returns true if this bullet has collided with the given player.
 */
Bullet.prototype.hit = function(player) {
  return Util.getManhattanDistance(this.x, this.y, player.x, player.y) <
    Bullet.COLLISION_DISTANCE;
};

/**
 * We reverse the coordinate system and apply sin(direction) to x because
 * canvas in HTML will use up as its '0' reference point while JS math uses
 * left as its '0' reference point.
 * this.direction always is stored in radians.
 */
Bullet.prototype.update = function(clients) {
  this.x += Bullet.VELOCITY * Math.sin(this.direction);
  this.y -= Bullet.VELOCITY * Math.cos(this.direction);
  this.distanceTraveled += Bullet.VELOCITY;

  if (this.distanceTraveled > Bullet.TRAVEL_DISTANCE) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  for (var i = 0; i < players.length; ++i) {
    if (this.firedBy != players[i].id && this.hit(players[i])) {
      players[i].health -= 1;
      if (players[i].health <= 0) {
        var killingPlayer = clients.get(this.firedBy);
        killingPlayer.score++;
        clients.set(this.firedBy, killingPlayer);
      }
      this.shouldExist = false;
      return;
    }
  }
};

exports.Bullet = Bullet;
