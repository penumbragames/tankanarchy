/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for a Player.
 * @param {number} x X-coordinate to generate the player at.
 * @param {number} y Y-coordinate to generate the player at.
 * @param {number} orientation Direction to face the player from 0 to 2PI.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player
 */
function Player(x, y, orientation, name, id) {
  this.name = name;
  this.id = id;

  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.turretAngle = orientation;

  this.health = 10;
  this.score = 0;
  this.lastShotTime = 0;
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
  if (this.health <= 0) {
    this.x = Math.random() * 2500;
    this.y = Math.random() * 2500;
    this.health = 10;
    this.score--;
  }

  if (keyboardState.up) {
    this.x += Player.VELOCITY * Math.sin(this.orientation);
    this.y -= Player.VELOCITY * Math.cos(this.orientation);
  }
  if (keyboardState.down) {
    this.x -= Player.VELOCITY * Math.sin(this.orientation);
    this.y += Player.VELOCITY * Math.cos(this.orientation);
  }
  if (keyboardState.right) {
    this.orientation = this.orientation + Player.TURN_RATE;
  }
  if (keyboardState.left) {
    this.orientation = this.orientation - Player.TURN_RATE;
  }

  this.x = Math.min(Math.max(this.x, Player.ENVIRONMENT_MIN),
                     Player.ENVIRONMENT_MAX);
  this.y = Math.min(Math.max(this.y, Player.ENVIRONMENT_MIN),
                     Player.ENVIRONMENT_MAX);

  this.turretAngle = turretAngle;
};

exports.Player = Player;
