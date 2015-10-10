/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var Bullet = require('./Bullet');
var Entity = require('./Entity');
var Powerup = require('./Powerup');

var Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
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
require('./inheritable');
Player.inheritsFrom(Entity);

/**
 * TURN_RATE is in radians per millisecond.
 * DEFAULT_VELOCITY_MAGNITUDE is in pixels per millisecond.
 * DEFAULT_SHOT_COOLDOWN is in milliseconds.
 * DEFAULT_HITBOX_SIZE is in pixels.
 * SHIELD_HITBOX_SIZE is in pixels.
 * MAX_HEALTH is in health units.
 * MINIMUM_RESPAWN_BUFFER is a distance in pixels.
 */
Player.TURN_RATE = 0.005;
Player.DEFAULT_VELOCITY_MAGNITUDE = 0.3;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.DEFAULT_HITBOX_SIZE = 20;
/**
 * Note: The shield hit distance does NOT match the size of the shield
 * in shield.png.
 */
Player.SHIELD_HITBOX_SIZE = 45;
Player.MAX_HEALTH = 10;
Player.MINIMUM_RESPAWN_BUFFER = 1000;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  var point = Util.getRandomWorldPoint();
  var orientation = Util.randRange(0, 2 * Math.PI);
  return new Player(point[0], point[1], orientation, name, id);
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
    this.vx = this.vmag * Math.sin(this.orientation);
    this.vy = -this.vmag * Math.cos(this.orientation);
  }
  if (keyboardState.down) {
    this.vx = -this.vmag * Math.sin(this.orientation);
    this.vy = this.vmag * Math.cos(this.orientation);
  }
  if (!keyboardState.up && !keyboardState.down) {
    this.vx = 0;
    this.vy = 0;
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

  var boundedCoord = Util.boundWorld(this.x, this.y);
  this.x = boundedCoord[0];
  this.y = boundedCoord[1];

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
  return (new Date()).getTime() >
    this.lastShotTime + this.shotCooldown;
};

/**
 * Returns an array containing projectiles that the player has fired,
 * factoring in all powerups. Assumes the shot cooldown has passed and the
 * player CAN shoot. Resets lastShotTime.
 * @return {Array.<Bullet>}
 */
Player.prototype.getProjectilesShot = function() {
  var bullets = [Bullet.create(this.x, this.y, this.turretAngle, this.id)];
  if (this.powerups[Powerup.SHOTGUN]) {
    for (var i = 1; i < this.powerups[Powerup.SHOTGUN].data + 1; ++i) {
      bullets.push(
        Bullet.create(this.x, this.y, this.turretAngle - (i * Math.PI / 9),
                      this.id));
      bullets.push(
        Bullet.create(this.x, this.y, this.turretAngle + (i * Math.PI / 9),
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
 */
Player.prototype.isCollidedWith = function(x, y, hitboxSize) {
  var minDistance = this.hitboxSize + hitboxSize;
  return Util.getEuclideanDistance2(this.x, this.y, x, y) <
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
 * @todo The player respawn calculation with the minimum buffer doesn't quite
 *   work.
 */
Player.prototype.respawn = function(players) {
  var point = Util.getRandomWorldPoint();
  var isValidSpawn = false;
  var iter = 0;
  while (!isValidSpawn || iter < 15) {
    isValidSpawn = true;
    for (var i = 0; i < players; ++i) {
      if (Util.getEuclideanDistance2(point[0], point[1],
                                     players[i].x, players[i].y) <
          Player.MINIMUM_RESPAWN_BUFFER * Player.MINIMUM_RESPAWN_BUFFER) {
        isValidSpawn = false;
        continue;
      }
    }
    point = Util.getRandomWorldPoint();
    iter++;
  }

  this.x = point[0];
  this.y = point[1];
  this.health = Player.MAX_HEALTH;
  this.deaths++;
};

module.exports = Player;
