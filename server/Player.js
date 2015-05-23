/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Player(x, y, orientation, name, id) {
  this.x_ = x;
  this.y_ = y;
  this.orientation_ = orientation;

  this.name_ = name;
  this.id_ = id;
};

/**
 * TURN_RATE is in radians per update.
 */
Player.TURN_RATE = Math.PI / 90;
Player.VELOCITY = 2.5;

Player.prototype.update = function(keyboardState) {
  if (keyboardState.up) {
    this.x_ += Player.VELOCITY * Math.sin(this.orientation_);
    this.y_ -= Player.VELOCITY * Math.cos(this.orientation_);
  }
  if (keyboardState.down) {
    this.x_ -= Player.VELOCITY * Math.sin(this.orientation_);
    this.y_ += Player.VELOCITY * Math.cos(this.orientation_);
  }
  if (keyboardState.right) {
    this.orientation_ = this.orientation_ + Player.TURN_RATE;
  }
  if (keyboardState.left) {
    this.orientation_ = this.orientation_ - Player.TURN_RATE;
  }
};

Player.prototype.getX = function() {
  return this.x_;
};

Player.prototype.getY = function() {
  return this.y_;
};

Player.prototype.getOrientation = function() {
  return this.orientation_;
};

Player.prototype.getName = function() {
  return this.name_;
};

Player.prototype.getID = function() {
  return this.id_;
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
