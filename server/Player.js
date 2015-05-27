/**
 * Stores the state of the player on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Bullet = require('./Bullet').Bullet;
var Util = require('./Util').Util;

/**
 * Constructor for a Player.
 * @param {number} x X-coordinate to generate the player at.
 * @param {number} y Y-coordinate to generate the player at.
 * @param {number} orientation Direction to face the player from 0 to 2 * PI.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
function Player(x, y, orientation, name, id) {
  this.x = x;
  this.y = y;
  this.orientation = orientation;
  this.turretAngle = orientation;

  this.name = name;
  this.id = id;

  this.health = Player.MAX_HEALTH;
  /**
   * this.powerups is a JSON Object of the format:
   * { 'powerup' : expires; 'powerup' : expires }
   */
  this.powerups = {};
  this.score = 0;
  this.lastShotTime = 0;
};

/**
 * TURN_RATE is in radians per update.
 * VELOCITY is in pixels per update.
 * SHOT_COOLDOWN is in milliseconds.
 * MAX_HEALTH is in health units.
 */
Player.TURN_RATE = Math.PI / 45;
Player.VELOCITY = 5;
Player.SHOT_COOLDOWN = 800;
Player.MAX_HEALTH = 10;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
Player.generateNewPlayer = function(name, id) {
  var point = Util.getRandomWorldPoint();
  var orientation = Util.randRange(0, 2 * Math.PI);
  return new Player(point[0], point[1], orientation, name, id);
};

/**
 * Updates this player given the the client's keyboard state and mouse angle
 * for setting the tank turret. Also updates the state of the powerups and
 * expires them if necessary.
 */
Player.prototype.update = function(keyboardState, turretAngle) {
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

  var boundedCoord = Util.boundWorld(this.x, this.y);
  this.x = boundedCoord[0];
  this.y = boundedCoord[1];

  this.turretAngle = turretAngle;

  for (var powerup in this.powerups) {
    if ((new Date()).getTime() > this.powerups[powerup]) {
      delete this.powerups[powerup];
    }
  }
};

/**
 * Applies a powerup to this player.
 * @param {string} name The name of the powerup to apply.
 * @param {number} duration The amount of time in milliseconds to apply the
 *   powerup for.
 */
Player.prototype.applyPowerup = function(name, duration) {
  this.powerups[name] = (new Date()).getTime() + duration;
};

/**
 * Returns a boolean indicating if the player's shot cooldown has passed and
 * the player can shoot.
 */
Player.prototype.canShoot = function() {
  return (new Date()).getTime() > this.lastShotTime;
};

/**
 * Returns an array containing bullets that the player has fired, factoring
 * in all powerups. Assumes the shot cooldown has passed and the player CAN
 * shoot. Resets lastShotTime.
 */
Player.prototype.getBulletsShot = function() {
  bullets = [new Bullet(this.x, this.y, this.turretAngle, this.id)];
  if (this.powerups.shotgun3 != null ||
      this.powerups.shotgun3 != undefined) {
    bullets.push(
      new Bullet(this.x, this.y, this.turretAngle - Math.PI / 9, this.id));
    bullets.push(
      new Bullet(this.x, this.y, this.turretAngle + Math.PI / 9, this.id));
  }
  this.lastShotTime = (new Date()).getTime();
  return bullets;
};

/**
 * Handles the respawning of the player when killed.
 * TODO: player respawn explosion animation.
 * TODO: smarter respawn
 */
Player.prototype.respawn = function() {
  var point = Util.getRandomWorldPoint();
  this.x = point[0];
  this.y = point[1];
  this.health = Player.MAX_HEALTH;
  this.score--;
};

exports.Player = Player;
