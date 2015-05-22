/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Player(x, y, name) {
  this.x_ = x;
  this.y_ = y;
  this.name_ = name;
};

Player.VELOCITY = 2;

Player.prototype.update = function(keyboardState) {
  if (keyboardState.up) {
    this.y_ -= Player.VELOCITY;
  }
  if (keyboardState.right) {
    this.x_ += Player.VELOCITY;
  }
  if (keyboardState.down) {
    this.y_ += Player.VELOCITY;
  }
  if (keyboardState.left) {
    this.x_ -= Player.VELOCITY;
  }
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

exports.Player = Player;
