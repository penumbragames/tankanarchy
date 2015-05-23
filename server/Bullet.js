/**
 * Stores the state of a bullet on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for a bullet.
 * @param {number} x The starting x-coordinate of a bullet (absolute).
 * @param {number} y The starting y-coordinate of a bullet (absolute).
 * @param {number} direction The direction the bullet will travel in
 *   radians.
 * @param {string} firedBy The socket ID of the client that fired the
 *   bullet.
 */
function Bullet(x, y, direction, firedBy) {
  this.startX_ = x;
  this.startY_ = y;
  this.x_ = x;
  this.y_ = y;
  this.direction_ = direction;
  this.firedBy_ = firedBy;
}

Bullet.VELOCITY = 15;
Bullet.TRAVEL_DISTANCE = 800;

/**
 * We reverse the coordinate system and apply sin(direction) to x because
 * canvas in HTML will use up as its '0' reference point while JS math uses
 * left as its '0' reference point.
 * this.direction_ always is stored in radians.
 */
Bullet.prototype.update = function() {
  this.x_ += Bullet.VELOCITY * Math.sin(this.direction_);
  this.y_ -= Bullet.VELOCITY * Math.cos(this.direction_);
}

Bullet.prototype.shouldExist = function() {
  return Math.sqrt((this.startX_ - this.x_) * (this.startX_ - this.x_) +
                   (this.startY_ - this.y_) * (this.startY_ - this.y_)) <
    Bullet.TRAVEL_DISTANCE;
}

exports.Bullet = Bullet;
