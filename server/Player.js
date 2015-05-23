/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Player(name, id) {
  this.name_ = name;
  this.id_ = id;

  this.x_ = 100;
  this.y_ = 100;
  this.orientation_ = 0;
  this.turretAngle_ = 0;
};

/**
 * TURN_RATE is in radians per update.
 */
Player.TURN_RATE = Math.PI / 45;
Player.VELOCITY = 5;

Player.prototype.update = function(keyboardState, turretAngle) {
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

  this.turretAngle_ = turretAngle;
};

exports.Player = Player;
