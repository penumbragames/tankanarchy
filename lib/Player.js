/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');
var Powerup = require('./Powerup');
var World = require('./World');

var Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
 * @param {Array.<number>} position The position of the player.
 * @param {number} orientation Direction to face the player from 0 to 2 * PI.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
function Player(position, orientation, name, id) {
  this.position = position;
  this.velocity = [0, 0];
  this.acceleration = [0, 0];

  this.orientation = orientation;
  this.turretAngle = orientation;
  this.name = name;
  this.id = id;

  /**
   * vmag represents the magnitude of the velocity and determines vx and vy
   * (inherited from Entity). turnRate is a rate of change for the orientation.
   */
  this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
  this.turnRate = 0;
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
  this.lastShotTime = 0;
  this.health = Player.MAX_HEALTH;
  /**
   * this.powerups is a JSON Object of the format:
   * { 'powerup' : { 'name' : name,
   *                 'data' : data,
   *                 'expirationTime' : expirationTime },
   *   'powerup' : { 'name' : name,
   *                 'data' : data,
   *                 'expirationTime' : expirationTime }
   * }
   */
  this.powerups = {};
  this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;

  this.kills = 0;
  this.deaths = 0;
}
require('../shared/base');
Player.inheritsFrom(Entity);

/**
 * TURN_RATE is in radians per millisecond.
 * @const
 * @type {number}
 */
Player.TURN_RATE = 0.005;

/**
 * DEFAULT_VELOCITY_MAGNITUDE is in pixels per second.
 * @const
 * @type {number}
 */
Player.DEFAULT_VELOCITY_MAGNITUDE = 300;

/**
 * DEFAULT_SHOT_COOLDOWN is in milliseconds.
 * @const
 * @type {number}
 */
Player.DEFAULT_SHOT_COOLDOWN = 800;

/**
 * DEFAULT_HITBOX_SIZE is in pixels.
 * @const
 * @type {number}
 */
Player.DEFAULT_HITBOX_SIZE = 20;

/**
 * SHIELD_HITBOX_SIZE is in pixels.
 * @const
 * @type {number}
 */
Player.SHIELD_HITBOX_SIZE = 45;

/**
 * MAX_HEALTH is in health units.
 * @const
 * @type {number}
 */
Player.MAX_HEALTH = 10;

/**
 * MINIMUM_RESPAWN_BUFFER is a distance in pixels.
 * Note: The shield hit distance does NOT match the size of the shield
 * in shield.png.
 * @const
 * @type {number}
 */
Player.MINIMUM_RESPAWN_BUFFER = 1000;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  var point = World.getRandomPoint();
  var orientation = Util.randRange(0, 2 * Math.PI);
  return new Player(point, orientation, name, id);
};

/**
 * Updates this player given the the client's keyboard state and mouse angle
 * for setting the tank turret.
 * @param {Object} keyboardState A JSON Object storing the state of the
 *   client keyboard.
 * @param {number} turretAngle The angle of the client's mouse with respect
 *   to the tank.
 */
Player.prototype.updateOnInput = function(keyboardState, turretAngle) {
  if (keyboardState.up) {
    this.velocity = [this.vmag * Math.sin(this.orientation),
                     -this.vmag * Math.cos(this.orientation)];
  }
  if (keyboardState.down) {
    this.velocity = [this.vmag * -Math.sin(this.orientation),
                     -this.vmag * Math.cos(this.orientation)];
  }
  if (!keyboardState.up && !keyboardState.down) {
    this.velocity = [0, 0];
  }
  if (keyboardState.right) {
    this.turnRate = Player.TURN_RATE;
  }
  if (keyboardState.left) {
    this.turnRate = -Player.TURN_RATE;
  }
  if (!keyboardState.right && !keyboardState.left) {
    this.turnRate = 0;
  }
  this.turretAngle = turretAngle;
};

/**
 * Updates the player's position and powerup states, this runs in the 60Hz
 * server side loop so that powerups expire even when the player is not
 * moving or shooting.
 */
Player.prototype.update = function() {
  this.parent.update.call(this);
  this.orientation += this.turnRate * this.updateTimeDifference;

  var boundedPosition = World.bound(this.getX(), this.getY());
  this.position = boundedPosition;

  // Loops through and applies powerups to the player. Removes them
  // when they expire.
  for (var powerup in this.powerups) {
    switch (powerup) {
      case Powerup.HEALTHPACK:
        this.health = Math.min(this.health + this.powerups[powerup].data,
                               Player.MAX_HEALTH);
        delete this.powerups[powerup];
        continue;
      case Powerup.SHOTGUN:
        break;
      case Powerup.RAPIDFIRE:
        this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN /
                            this.powerups[powerup].data;
        break;
      case Powerup.SPEEDBOOST:
        this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE *
            this.powerups[powerup].data;
        break;
      case Powerup.SHIELD:
        this.hitboxSize = Player.SHIELD_HITBOX_SIZE;
        if (this.powerups[powerup].data <= 0) {
          delete this.powerups[powerup];
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;
          continue;
        }
        break;
    }
    if ((new Date()).getTime() > this.powerups[powerup].expirationTime) {
      switch (powerup) {
        case Powerup.HEALTHPACK:
          break;
        case Powerup.SHOTGUN:
          break;
        case Powerup.RAPIDFIRE:
          this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
          break;
        case Powerup.SPEEDBOOST:
          this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE;
          break;
        case Powerup.SHIELD:
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE;
          break;
      }
      delete this.powerups[powerup];
    }
  }
};

/**
 * Applies a powerup to this player.
 * @param {string} name The name of the powerup to apply.
 * @param {Object} powerup An object containing the powerup's associated data
 *   and expiration time.
 */
Player.prototype.applyPowerup = function(name, powerup) {
  this.powerups[name] = powerup;
};

/**
 * Returns a boolean indicating if the player's shot cooldown has passed and
 * the player can shoot.
 * @return {boolean}
 */
Player.prototype.canShoot = function() {
  return (new Date()).getTime() > this.lastShotTime + this.shotCooldown;
};

/**
 * Returns an array containing projectiles that the player has fired,
 * factoring in all powerups. Assumes the shot cooldown has passed and the
 * player CAN shoot. Resets lastShotTime.
 * @return {Array.<Bullet>}
 */
Player.prototype.getProjectilesShot = function() {
  var bullets = [Bullet.create(this.position, this.turretAngle, this.id)];
  if (this.powerups[Powerup.SHOTGUN]) {
    for (var i = 1; i < this.powerups[Powerup.SHOTGUN].data + 1; ++i) {
      bullets.push(
          Bullet.create(this.position, this.turretAngle - (i * Math.PI / 9),
                        this.id));
      bullets.push(
          Bullet.create(this.position, this.turretAngle + (i * Math.PI / 9),
                        this.id));
    }
  }
  this.lastShotTime = (new Date()).getTime();
  return bullets;
};

/**
 * Used to determine if two objects have collided, factors in shields, since
 * they increase the player's hitbox. This collision detection method assumes
 * all objects have circular hitboxes.
 * @param {number} x The x-coordinate of the center of the object's circular
 *   hitbox.
 * @param {number} y The y-coordinate of the center of the object's circular
 *   hitbox.
 * @param {number} hitboxSize The radius of the object's circular
 *   hitbox.
 * @return {boolean}
 */
Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
  var minDistance = this.hitboxSize + hitboxSize;
  return Util.getEuclideanDistance2(this.getX(), this.getY(), x, y) <
      (minDistance * minDistance);
};

/**
 * Returns a boolean determining if the player is dead or not.
 * @return {boolean}
 */
Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * Damages the player by the given amount, factoring in shields.
 * @param {number} amount The amount to damage the player by.
 */
Player.prototype.damage = function(amount) {
  if (this.powerups[Powerup.SHIELD]) {
    this.powerups[Powerup.SHIELD].data -= 1;
  } else {
    this.health -= amount;
  }
};

/**
 * Handles the respawning of the player when killed.
 * @param {Array.<Player>} players An array of players to check against for
 *   smart respawning.
 * TODO: The player respawn calculation with the minimum buffer doesn't quite
 *   work.
 */
Player.prototype.respawn = function(players) {
  this.position = World.getRandomPoint();
  this.health = Player.MAX_HEALTH;
  this.deaths++;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
