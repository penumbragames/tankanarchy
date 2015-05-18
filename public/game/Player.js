/**
 * Stores the state of a player.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Player(x, y, name) {
  this.x_ = x;
  this.y_ = y;
  this.name_ = name;
};

Player.VELOCITY = 2;

Player.prototype.update = function() {
  var offsetX = 0;
  var offsetY = 0;
  if (KeyboardBuffer.LEFT) {
    offsetX -= Player.VELOCITY;
  }
  if (KeyboardBuffer.UP) {
    offsetY -= Player.VELOCITY;
  }
  if (KeyboardBuffer.RIGHT) {
    offsetX += Player.VELOCITY;
  }
  if (KeyboardBuffer.DOWN) {
    offsetY += Player.VELOCITY;
  }
  this.x_ += offsetX;
  this.y_ += offsetY;
};

Player.prototype.getX = function() {
  return this.x_;
};

Player.prototype.getY = function() {
  return this.y_;
};

Player.prototype.getName = function() {
  return this.name_;
};

Player.prototype.setX = function(x) {
  this.x_ = x;
  return this;
};

Player.prototype.setY = function(y) {
  this.y_ = y;
  return this;
};

Player.prototype.setName = function(name) {
  this.name_ = name;
  return this;
};

Player.prototype.draw = function(ctx) {
  ctx.fillRect(this.x_ - 5, this.y_ - 5, 10, 10);
};
