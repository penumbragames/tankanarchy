/**
 * Game class on the server to manage the state of existing players and
 * and objects.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var HashMap = require('hashmap');
var Player = require('./Player');
var Bullet = require('./Bullet');
var Powerup = require('./Powerup');

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 */
function Game() {
  this.clients = new HashMap();
  this.projectiles = [];
  this.powerups = [];

  return this;
};

/**
 * MAX_MAP_POWERUPS is the maximum of number of powerups that can be active
 *   on the map at any given point in time.
 */
Game.MAX_MAP_POWERUPS = 10;

/**
 * Creates a new player with the given name and ID.
 * @param {string} The display name of the player.
 * @param {string} The socket ID of the player.
 */
Game.prototype.addNewPlayer = function(name, id) {
  this.clients.set(id, Player.generateNewPlayer(name, id));
};

/**
 * Removes the player with the given socket ID.
 * @param {string} The socket ID of the player to remove.
 */
Game.prototype.removePlayer = function(id) {
  if (this.clients.has(id)) {
    this.clients.remove(id);
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
  var player = this.clients.get(id);
  if (player != undefined && player != null) {
    player.updateOnInput(keyboardState, turretAngle);
  }
};

/**
 * Returns an array of the currently active players.
 * @return {Array.<Player>}
 */
Game.prototype.getPlayers = function() {
  return this.clients.values();
};

/**
 * Given a socket ID, adds a projectile that was fired by the player
 * associated with that ID.
 * @param {string} The socket ID of the player that fired a projectile.
 */
Game.prototype.addProjectile = function(id) {
  var player = this.clients.get(id);
  if (player != undefined && player != null && player.canShoot()) {
    this.projectiles = this.projectiles.concat(
      player.getProjectilesShot());
  }
};

/**
 * Returns an array of the currently existing projectiles.
 * @return {Array.<Object>}
 */
Game.prototype.getProjectiles = function() {
  return this.projectiles;
};

/**
 * Returns an array of the currently existing powerups.
 * @return {Array.<Powerup>}
 */
Game.prototype.getPowerups = function() {
  return this.powerups;
};

/**
 * Updates the state of all the objects in the game.
 * @param {Socket} io The Socket object to which to emit update packets.
 */
Game.prototype.update = function(io) {
  var players = this.getPlayers();
  for (var i = 0; i < players.length; ++i) {
    players[i].update();
  }
  
  for (var i = 0; i < this.projectiles.length; ++i) {
    if (this.projectiles[i].shouldExist) {
      this.projectiles[i].update(this.clients);
    } else {
      io.sockets.emit('explosion', this.projectiles.splice(i, 1));
      i--;
    }
  }

  // Ensure that there are always 10 powerups on the map.
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
  
  // Sends update packets every client.
  io.sockets.emit('update-players', players);
  io.sockets.emit('update-projectiles', this.getProjectiles());
  io.sockets.emit('update-powerups', this.getPowerups());
};

module.exports = Game;
