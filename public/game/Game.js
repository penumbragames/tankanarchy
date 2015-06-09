/**
 * Class containing the game, handles drawing and updates.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Creates a game on the client side to manage and render the players,
 * projectiles, and powerups.
 * @constructor
 * @param {Element} canvas The HTML5 canvas to render the game on.
 * @param {Socket} socket The socket connected to the server.
 */
function Game(canvas, socket) {
  this.canvas = canvas;
  this.canvas.width = Game.WIDTH;
  this.canvas.height = Game.HEIGHT;
  this.canvasContext = this.canvas.getContext('2d');

  this.socket = socket;

  this.drawing = new Drawing(this.canvasContext);
  this.viewPort = new ViewPort();
  this.environment = new Environment(this.viewPort, this.drawing);

  this.id = null;
  this.players = [];
  this.projectiles = [];
  this.powerups = [];
};

Game.WIDTH = 800;
Game.HEIGHT = 600;
Game.SHOOTING_INTERVAL = 800;

/**
 * Stores this client's socket ID after getting it back from the server.
 * @param {string} id This client's socket ID.
 */
Game.prototype.setID = function(id) {
  this.id = id;
  this.viewPort.setID(id);
};

/**
 * Returns the object in the players array that represents this client's
 * player instance.
 * @return {Object}
 */
Game.prototype.findSelf = function() {
  for (var i = 0; i < this.players.length; ++i) {
    if (this.players[i].id == this.id) {
      return this.players[i];
    }
  }
  return null;
};

/**
 * Updates the game's storage of all the players, called each time
 * the server sends a packet.
 * @param {Array.<Object>} players An array of objects representing all
 *   the active players.
 */
Game.prototype.receivePlayers = function(players) {
  this.players = players;
};

/**
 * Updates the game's storage of all the projectiles, called each time
 * the server sends a packet.
 * @param {Array.<Object>} projectiles An array of objects representing all
 *   the active projectiles.
 */
Game.prototype.receiveProjectiles = function(projectiles) {
  this.projectiles = projectiles;
};

/**
 * Updates the game's storage of all the powerups, called each time
 * the server sends packet.
 * @param {Array.<Object>} powerups An array of objects representing all the
 *   existing powerups.
 */
Game.prototype.receivePowerups = function(powerups) {
  this.powerups = powerups;
};

/**
 * Starts an explosion animation given an object representing a bullet that
 * has reached the end of it's path or collided with a player.
 * @param {Object} object Um idk
 * @todo Finish this method
 */
Game.prototype.createExplosion = function(object) {
  var point = [object.x, object.y];
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  var self = this.findSelf();
  this.viewPort.update(self.x, self.y);

  var turretAngle = Math.atan2(
    Input.MOUSE[1] - Game.HEIGHT / 2,
    Input.MOUSE[0] - Game.WIDTH / 2) + Math.PI / 2;

  // Emits an event for the containing the player's intention to move
  // to the server.
  this.socket.emit('move-player', {
    keyboardState: {
      up: Input.UP,
      right: Input.RIGHT,
      down: Input.DOWN,
      left: Input.LEFT
    },
    turretAngle: turretAngle
  });

  // Emits an event for the player shooting to the server.
  if (Input.LEFT_CLICK) {
    var self = this.findSelf();
    this.socket.emit('fire-bullet');
  }

  // Updates the leaderboard.
  this.players.sort(function(o1, o2) {
    return o2.score > o1.score;
  });
  $('#leaderboard').empty();
  for (var i = 0; i < Math.min(this.players.length, 10); ++i) {
    $('#leaderboard').append($('<li>').text(
      this.players[i].name + ": " + this.players[i].score))
  };
};

/**
 * Draws the state of the game onto the HTML5 canvas.
 */
Game.prototype.draw = function() {
  this.canvasContext.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);

  this.environment.draw();

  // @todo refactor projectiles to projectiles
  for (var i = 0; i < this.projectiles.length; ++i) {
    this.drawing.drawBullet(
      this.viewPort.toCanvasCoords(this.projectiles[i]),
      this.projectiles[i].direction);
  }

  var visiblePowerups = this.viewPort.getVisibleObjects(this.powerups);
  for (var i = 0; i < visiblePowerups.length; ++i) {
    this.drawing.drawPowerup(
      this.viewPort.toCanvasCoords(visiblePowerups[i]),
      visiblePowerups[i].name);
  }


  var visiblePlayers = this.viewPort.getVisibleObjects(this.players);
  console.log(visiblePlayers);
  for (var i = 0; i < visiblePlayers.length; ++i) {
    this.drawing.drawTank(
      visiblePlayers[i].id == this.id,
      this.viewPort.toCanvasCoords(visiblePlayers[i]),
      visiblePlayers[i].orientation,
      visiblePlayers[i].turretAngle,
      visiblePlayers[i].name,
      visiblePlayers[i].health,
      visiblePlayers[i].powerups['shield_powerup']);
  }
};
