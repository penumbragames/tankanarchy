/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Creates a game on the client side to manage and render the players,
 * projectiles, and powerups.
 * @constructor
 * @param {Socket} socket The socket connected to the server.
 * @param {Element} canvas The HTML5 canvas to render the game on.
 * @param {Element} leaderboard The div element to render the leaderboard in.
 */
function Game(socket, canvas, leaderboard) {
  this.socket = socket;

  this.canvas = canvas;
  this.canvas.width = Constants.CANVAS_WIDTH;
  this.canvas.height = Constants.CANVAS_HEIGHT;
  this.canvasContext = this.canvas.getContext('2d');

  this.leaderboard = new Leaderboard(leaderboard);

  this.drawing = new Drawing(this.canvasContext);
  this.viewPort = new ViewPort();
  this.environment = new Environment(this.viewPort, this.drawing);

  this.self = null;
  this.players = [];
  this.projectiles = [];
  this.powerups = [];
  this.explosions = [];
  this.latency = 0;
};

/**
 * Initializes the game and sets the game to respond to update packets from the
 * server.
 */
Game.prototype.init = function() {
  var context = this;
  this.socket.on('update', function(data) {
    context.receiveGameState(data);
  });
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object}
 */
Game.prototype.receiveGameState = function(state) {
  this.leaderboard.update(state.leaderboard);

  this.self = state.self;
  this.players = state.players;
  this.projectiles = state.projectiles;
  this.powerups = state.powerups;
  this.explosions = state.explosions;
  this.latency = state.latency;
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    this.viewPort.update(this.self.x, this.self.y);

    var turretAngle = Math.atan2(
      Input.MOUSE[1] - Constants.CANVAS_HEIGHT / 2,
      Input.MOUSE[0] - Constants.CANVAS_WIDTH / 2) + Math.PI / 2;

    // Emits an event for the containing the player's intention to move
    // or shoot to the server.
    var packet = {
      keyboardState: {
        up: Input.UP,
        right: Input.RIGHT,
        down: Input.DOWN,
        left: Input.LEFT
      },
      turretAngle: turretAngle,
      shot: Input.LEFT_CLICK || Input.TOUCH,
      timestamp: (new Date()).getTime()
    };
    this.socket.emit('player-action', packet);
  }
};

/**
 * Draws the state of the game onto the HTML5 canvas.
 */
Game.prototype.draw = function() {
  // Clear the canvas.
  this.canvasContext.clearRect(0, 0, Constants.CANVAS_WIDTH,
                               Constants.CANVAS_HEIGHT);

  // Draw the background first.
  this.environment.draw();

  // Draw the projectiles next.
  for (var i = 0; i < this.projectiles.length; ++i) {
    this.drawing.drawBullet(
      this.viewPort.toCanvasCoords(this.projectiles[i]),
      this.projectiles[i].orientation);
  }

  // Draw the powerups next.
  for (var i = 0; i < this.powerups.length; ++i) {
    this.drawing.drawPowerup(
      this.viewPort.toCanvasCoords(this.powerups[i]),
      this.powerups[i].name);
  }

  // Draw the tank that represents the player.
  if (this.self) {
    this.drawing.drawTank(
      true,
      this.viewPort.toCanvasCoords(this.self),
      this.self.orientation,
      this.self.turretAngle,
      this.self.name,
      this.self.health,
      this.self.powerups['shield_powerup']);
  }
  // Draw any other tanks.
  for (var i = 0; i < this.players.length; ++i) {
    this.drawing.drawTank(
      false,
      this.viewPort.toCanvasCoords(this.players[i]),
      this.players[i].orientation,
      this.players[i].turretAngle,
      this.players[i].name,
      this.players[i].health,
      this.players[i].powerups['shield_powerup']);
  }
};
