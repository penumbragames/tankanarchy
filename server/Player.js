/**
 * Stores the state of the player on the server.
 * @author Alvin Lin <alvin.lin@stuypulse.com>
 */

var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Util = require('./Util');

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

  this.velocity = Player.DEFAULT_VELOCITY;
  this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN;
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
  this.hasShield = false;
  this.collisionDistance = Player.DEFAULT_COLLISION_DISTANCE;
  this.debuffs = {};

  this.score = 0;
  this.lastShotTime = 0;

  return this;
};

/**
 * TURN_RATE is in radians per update.
 * VELOCITY is in pixels per update.
 * DEFAULT_SHOT_COOLDOWN is in milliseconds.
 * MAX_HEALTH is in health units.
 * MINIMUM_RESPAWN_BUFFER is a distance in pixels.
 */
Player.TURN_RATE = Math.PI / 45;
Player.DEFAULT_VELOCITY = 5;
Player.DEFAULT_SHOT_COOLDOWN = 800;
Player.DEFAULT_COLLISION_DISTANCE = 20;
/**
 * Note: The shield hit distance does NOT match the size of the shield
 * in shield.png.
 */
Player.SHIELD_COLLISION_DISTANCE = 35;
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
 * for setting the tank turret. Also updates the state of the powerups and
 * expires them if necessary.
 * @param {Object} keyboardState A JSON Object storing the state of the
 *   client keyboard.
 * @param {number} turretAngle The angle of the client's mouse with respect
 *   to the tank.
 */
Player.prototype.update = function(keyboardState, turretAngle) {
  if (keyboardState.up) {
    this.x += this.velocity * Math.sin(this.orientation);
    this.y -= this.velocity * Math.cos(this.orientation);
  }
  if (keyboardState.down) {
    this.x -= this.velocity * Math.sin(this.orientation);
    this.y += this.velocity * Math.cos(this.orientation);
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

  // Loops through and applies powerups to the player. Removes them
  // when they expire.
  for (var powerup in this.powerups) {
    switch (powerup) {
      case Powerup.HEALTHPACK:
        this.health += this.powerups[powerup].data;
        delete this.powerups[powerup];
        continue;
      case Powerup.SHOTGUN:
        break;
      case Powerup.RAPIDFIRE:
        this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN /
                            this.powerups[powerup].data;
        break;
      case Powerup.SPEEDBOOST:
        this.velocity = Player.DEFAULT_VELOCITY *
                        this.powerups[powerup].data;
        break;
      case Powerup.SHIELD:
        this.hasShield = true;
        this.collisionDistance = Player.SHIELD_COLLISION_DISTANCE;
        if (this.powerups[powerup].data == 0) {
          delete this.powerups[powerup];
          this.hasShield = false;
          this.collisionDistance = Player.DEFAULT_COLLISION_DISTANCE;
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
          this.velocity = Player.DEFAULT_VELOCITY;
          break;
        case Powerup.SHIELD:
          this.hasShield = false;
          this.collisionDistance = Player.DEFAULT_COLLISION_DISTANCE;
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
  bullets = [new Bullet(this.x, this.y, this.turretAngle, this.id)];
  if (this.powerups[Powerup.SHOTGUN] != null &&
      this.powerups[Powerup.SHOTGUN] != undefined) {
    for (var i = 1; i < this.powerups[Powerup.SHOTGUN].data + 1; ++i) {
      bullets.push(
        new Bullet(this.x, this.y, this.turretAngle - (i * Math.PI / 9),
                   this.id));
      bullets.push(
        new Bullet(this.x, this.y, this.turretAngle + (i * Math.PI / 9),
                   this.id));
    }
  }
  this.lastShotTime = (new Date()).getTime();
  return bullets;
};

/**
 * Returns true if the given point is close enough to the player to count
 * as a collision, factors in shields, since they increase the player's
 * hitbox.
 */
Player.prototype.isHit = function(x, y, hitboxSize) {
  var minDistance = this.collisionDistance + hitboxSize;
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
  if (this.powerups[Powerup.SHIELD] != null &&
      this.powerups[Powerup.SHIELD] != null) {
    this.powerups[Powerup.SHIELD] -= 1;
  } else {   
    this.health -= damage;
  }
};

/**
 * Handles the respawning of the player when killed.
 * @param {Array.<Player>} players An array of players to check against for
 *   smart respawning.
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
  this.score--;
};

module.exports = Player;
