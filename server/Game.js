/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var HashMap = require('hashmap');

var Player = require('./Player');
var Bullet = require('./Bullet');
var Powerup = require('./Powerup');
var Explosion = require('./Explosion');

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 */
function Game() {
  /**
   * This is a hashmap containing all the connected socket ids and socket
   * instances.
   */
  this.sockets = new HashMap();

  /**
   * This is a hashmap containing all the connected socket ids and the players
   * associated with them. This should always be parallel with sockets.
   */
  this.players = new HashMap();

  /**
   * These arrays contain entities in the game world. They do not need to be
   * stored in a hashmap because they do not have a unique id.
   */
  this.projectiles = [];
  this.powerups = [];
  this.explosions = [];
};

/**
 * MAX_MAP_POWERUPS is the maximum of number of powerups that can be active
 *   on the map at any given point in time.
 */
Game.MAX_MAP_POWERUPS = 10;

/**
 * Creates a new player with the given name and ID.
 * @param {string} The display name of the player.
 * @param {Object} The socket object of the player.
 */
Game.prototype.addNewPlayer = function(name, socket) {
  this.sockets.set(socket.id, socket);
  this.players.set(socket.id, Player.generateNewPlayer(name, socket.id));
};

/**
 * Removes the player with the given socket ID.
 * @param {string} The socket ID of the player to remove.
 */
Game.prototype.removePlayer = function(id) {
  if (this.sockets.has(id)) {
    this.sockets.remove(id);
  }
  if (this.players.has(id)) {
    this.players.remove(id);
  }
};

/**
 * Updates the player with the given ID according to the
 * input state sent by that player's client.
 * @param {string} id The socket ID of the player to update.
 * @param {Object} keyboardState The state of the player's keyboard.
 * @param {number} turretAngle The angle of the player's tank's turret
 *   in radians.
 */
Game.prototype.updatePlayer = function(id, keyboardState, turretAngle) {
  var player = this.players.get(id);
  if (player != undefined && player != null) {
    player.updateOnInput(keyboardState, turretAngle);
  }
};

/**
 * Given a socket ID, adds a projectile that was fired by the player
 * associated with that ID if and only if that player can fire.
 * @param {string} The socket ID of the player that fired a projectile.
 */
Game.prototype.addProjectileFiredBy = function(id) {
  var player = this.players.get(id);
  if (player != undefined && player != null && player.canShoot()) {
    this.projectiles = this.projectiles.concat(
      player.getProjectilesShot());
  }
};

/**
 * Adds an explosion to the internally maintained array.
 * @param {Explosion} explosion The explosion to add.
 */
Game.prototype.addExplosion = function(explosion) {
  this.explosions.push(explosion);
};

/**
 * Returns an array of the currently active players.
 * @return {Array.<Player>}
 */
Game.prototype.getPlayers = function() {
  return this.players.values();
};

/**
 * Updates the state of all the objects in the game.
 */
Game.prototype.update = function() {
  // Update all the players.
  var players = this.getPlayers();
  for (var i = 0; i < players.length; ++i) {
    players[i].update();
  }

  // Update all the projectiles.
  for (var i = 0; i < this.projectiles.length; ++i) {
    if (this.projectiles[i].shouldExist) {
      this.projectiles[i].update(this.players);
    } else {
      var removedProjectile = this.projectiles.splice(i, 1);
      this.addExplosion(new Explosion(removedProjectile.x,
                                      removedProjectile.y,
                                      100, 1000));
      i--;
    }
  }

  // Update the powerups and ensure that there are always 10 powerups on
  // the map.
  while (this.powerups.length < Game.MAX_MAP_POWERUPS) {
    this.powerups.push(Powerup.generateRandomPowerup());
  }
  for (var i = 0; i < this.powerups.length; ++i) {
    if (this.powerups[i].shouldExist) {
      this.powerups[i].update(this.getPlayers());
    } else {
      this.powerups.splice(i, 1);
      i--;
    }
  }

  // Update the explosions.
  for (var i = 0; i < this.explosions.length; ++i) {
    if (this.explosions[i].isExpired()) {
      this.explosions.splice(i, 1);
      i--;
    }
  }
};

/**
 * Sends the state of the game to all the connected sockets after
 * filtering them appropriately.
 */
Game.prototype.sendState = function() {
  // filter for visible.
  var ids = this.sockets.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.sockets.get(ids[i]).emit('update', {
      players: this.players.values(),
      projectiles: this.projectiles,
      powerups: this.powerups,
      explosions: this.explosions
    });
  }
};

module.exports = Game;
