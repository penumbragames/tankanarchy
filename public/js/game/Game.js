/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Creates a game on the client side to manage and render the players,
 * projectiles, and powerups.
 * @constructor
 * @param {Object} socket The socket connected to the server.
 * @param {Leaderboard} leaderboard The Leaderboard object to update.
 * @param {Drawing} drawing The Drawing object that will render the game.
 * @param {ViewPort} viewPort The ViewPort object that will manage the
 *   player's view of the entities.
 */
function Game(socket, leaderboard, drawing, viewPort) {
  this.socket = socket;

  this.leaderboard = leaderboard;
  this.drawing = drawing;
  this.viewPort = viewPort;

  this.self = null;

  /**
   * @type {Array<Object>}
   */
  this.players = [];

  /**
   * @type {Array<Object>}
   */
  this.projectiles = [];

  /**
   * @type {Array<Object>}
   */
  this.powerups = [];

  /**
   * @type {Array<Object>}
   */
  this.explosions = [];
  this.latency = 0;

  this.animationFrameId = 0;
}

/**
 * Factory method for the Game class.
 * @param {Object} socket The socket connected to the server.
 * @param {Element} canvasElement The HTML5 canvas to render the game on.
 * @param {Element} leaderboardElement The div element to render the
 *   leaderboard in.
 * @return {Game}
 */
Game.create = function(socket, canvasElement, leaderboardElement) {
  canvasElement.width = Constants.CANVAS_WIDTH;
  canvasElement.height = Constants.CANVAS_HEIGHT;
  var canvasContext = canvasElement.getContext('2d');

  var leaderboard = Leaderboard.create(leaderboardElement);
  var drawing = Drawing.create(canvasContext);
  var viewPort = ViewPort.create();

  var game = new Game(socket, leaderboard, drawing, viewPort);
  game.init();
  return game;
};

/**
 * Initializes the game and sets the event handler for the server packets.
 */
Game.prototype.init = function() {
  this.socket.on('update', bind(this, function(data) {
    this.receiveGameState(data);
  }));
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object} state An object containing the state of the game sent by
 *   the server.
 */
Game.prototype.receiveGameState = function(state) {
  this.leaderboard.update(state['leaderboard']);

  this.self = state['self'];
  this.players = state['players'];
  this.projectiles = state['projectiles'];
  this.powerups = state['powerups'];
  this.explosions = state['explosions'];
  this.latency = state['latency'];
};

/**
 * This method begins the animation loop for the game.
 */
Game.prototype.animate = function() {
  this.animationFrameId = window.requestAnimationFrame(
      bind(this, this.run));
};

/**
 * This method stops the animation loop for the game.
 */
Game.prototype.stopAnimation = function() {
  window.cancelAnimationFrame(this.animationFrameId);
};

/**
 * This method is a convenience method that calls update and draw.
 */
Game.prototype.run = function() {
  this.update();
  this.draw();
  this.animate();
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    this.viewPort.update(this.self['position'], this.self['position']);

    var turretAngle = Math.atan2(
        Input.MOUSE[1] - Constants.CANVAS_HEIGHT / 2,
        Input.MOUSE[0] - Constants.CANVAS_WIDTH / 2) + Math.PI / 2;

    // Emits an event for the containing the player's intention to move
    // or shoot to the server.
    var packet = {
      'keyboardState': {
        'up': Input.UP,
        'right': Input.RIGHT,
        'down': Input.DOWN,
        'left': Input.LEFT
      },
      'turretAngle': turretAngle,
      'shot': Input.LEFT_CLICK,
      'timestamp': (new Date()).getTime()
    };
    this.socket.emit('player-action', packet);
  }
};

/**
 * Draws the state of the game onto the HTML5 canvas.
 */
Game.prototype.draw = function() {
  if (this.self) {
    // Clear the canvas.
    this.drawing.clear();

    /**
     * Draw the background first behind the other entities, we calculate the
     * closest top-left coordinate outside of the ViewPort. We use that
     * coordinate to draw background tiles from left to right, top to bottom,
     * so that the entire ViewPort is appropriately filled.
     */
    var center = this.viewPort.selfCoords;
    var leftX = this.self['position'][0] - Constants.CANVAS_WIDTH / 2;
    var topY = this.self['position'][1] - Constants.CANVAS_HEIGHT / 2;
    var drawStartX = Math.max(
        leftX - (leftX % Drawing.TILE_SIZE), Constants.WORLD_MIN);
    var drawStartY = Math.max(
        topY - (topY % Drawing.TILE_SIZE), Constants.WORLD_MIN);
    /**
     * drawEndX and drawEndY have an extra Drawing.TILE_SIZE added to account
     * for the edge case where we are at the bottom rightmost part of the
     * world.
     */
    var drawEndX = Math.min(
        drawStartX + Constants.CANVAS_WIDTH + Drawing.TILE_SIZE,
        Constants.WORLD_MAX);
    var drawEndY = Math.min(
        drawStartY + Constants.CANVAS_HEIGHT + Drawing.TILE_SIZE,
        Constants.WORLD_MAX);
    this.drawing.drawTiles(
        this.viewPort.toCanvasX(drawStartX),
        this.viewPort.toCanvasY(drawStartY),
        this.viewPort.toCanvasX(drawEndX),
        this.viewPort.toCanvasY(drawEndY)
    );

    // Draw the projectiles next.
    for (var i = 0; i < this.projectiles.length; ++i) {
      this.drawing.drawBullet(
          this.viewPort.toCanvasCoords(this.projectiles[i]),
          this.projectiles[i]['orientation']);
    }

    // Draw the powerups next.
    for (var i = 0; i < this.powerups.length; ++i) {
      this.drawing.drawPowerup(
          this.viewPort.toCanvasCoords(this.powerups[i]),
          this.powerups[i]['name']);
    }

    // Draw the tank that represents the player.
    if (this.self) {
      this.drawing.drawTank(
          true,
          this.viewPort.toCanvasCoords(this.self),
          this.self['orientation'],
          this.self['turretAngle'],
          this.self['name'],
          this.self['health'],
          this.self['powerups']['shield_powerup']);
    }
    // Draw any other tanks.
    for (var i = 0; i < this.players.length; ++i) {
      this.drawing.drawTank(
          false,
          this.viewPort.toCanvasCoords(this.players[i]),
          this.players[i]['orientation'],
          this.players[i]['turretAngle'],
          this.players[i]['name'],
          this.players[i]['health'],
          this.players[i]['powerups']['shield_powerup']);
    }
  }
};
