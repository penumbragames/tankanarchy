/**
 * Stores the state of a bullet on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Bullet(x, y, direction, firedBy) {
  this.startX_ = x;
  this.startY_ = y;
  this.x_ = x;
  this.y_ = y;
  this.direction_ = direction;
  this.firedBy_ = firedBy;
}

Bullet.VELOCITY = 10;
Bullet.TRAVEL_DISTANCE = 100;

Bullet.prototype.update = function() {
  this.x_ += Bullet.VELOCITY * Math.cos(this.direction_);
  this.y_ -= Bullet.VELOCITY * Math.sin(this.direction_);
}

Bullet.prototype.shouldExist = function() {
  return Math.sqrt((this.startX_ - this.x_) * (this.startX_ - this.x_) +
                   (this.startY_ - this.y_) * (this.startY_ - this.y_)) <
    Bullet.TRAVEL_DISTANCE;
}
