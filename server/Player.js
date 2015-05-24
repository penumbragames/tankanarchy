/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for a Player.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player
 */
function Player(x, y, orientation, name, id) {
  this.name_ = name;
  this.id_ = id;

  this.x_ = x;
  this.y_ = y;
  this.orientation_ = orientation;
  this.turretAngle_ = orientation;

  this.health_ = 10;
  this.score_ = 0;
  this.lastShotTime_ = 0;
};

/**
 * TURN_RATE is in radians per update.
 */
Player.TURN_RATE = Math.PI / 45;
Player.VELOCITY = 5;
Player.ENVIRONMENT_MIN = 0;
Player.ENVIRONMENT_MAX = 2500;
Player.SHOT_COOLDOWN = 800;

Player.prototype.update = function(keyboardState, turretAngle) {
  if (this.health_ <= 0) {
    this.x_ = Math.random() * 2500;
    this.y_ = Math.random() * 2500;
    this.health_ = 10;
    this.score_--;
  }

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

  this.x_ = Math.min(Math.max(this.x_, Player.ENVIRONMENT_MIN),
                     Player.ENVIRONMENT_MAX);
  this.y_ = Math.min(Math.max(this.y_, Player.ENVIRONMENT_MIN),
                     Player.ENVIRONMENT_MAX);

  this.turretAngle_ = turretAngle;
};

exports.Player = Player;
