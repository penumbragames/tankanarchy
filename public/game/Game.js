/**
 * Class containing the game, handles drawing and updates.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Game(canvas, socket) {
  this.canvas = canvas;
  this.canvas.width = Game.WIDTH;
  this.canvas.height = Game.HEIGHT;
  this.canvasContext = this.canvas.getContext('2d');

  this.drawing = new Drawing(this.canvasContext);
  this.viewPort = new ViewPort();
  this.environment = new Environment(this.viewPort, this.drawing);

  this.socket = socket;

  this.id = null;
  this.players = [];
  this.bullets = [];
  this.healthPacks = [];
  this.lastShotTime = 0;
};

Game.WIDTH = 800;
Game.HEIGHT = 600;
Game.SHOOTING_INTERVAL = 800;

Game.prototype.setID = function(id) {
  this.id = id;
  this.viewPort.setID(id);
};

Game.prototype.update = function() {
  var self = this.findSelf();
  this.viewPort.update(self.x, self.y);
  var turretAngle = Math.atan2(
    Input.MOUSE[1] - Game.HEIGHT / 2,
    Input.MOUSE[0] - Game.WIDTH / 2) + Math.PI / 2;
  // Emits an event for the player's movement to the server.
  this.socket.emit('move-player', {
    id: this.id,
    keyboardState: {
      up: Input.UP,
      right: Input.RIGHT,
      down: Input.DOWN,
      left: Input.LEFT
    },
    turretAngle: turretAngle
  });

  // Emits an event for the player shooting to the server.
  // This event is limited to being sent every 800ms. If this breaks
  // due to people messing with the client, the server acts as a backup
  // to only allow the player to shoot every 800ms.
  if (Input.LEFT_CLICK) {
    var time = (new Date).getTime();
    if (time > this.lastShotTime + Game.SHOOTING_INTERVAL) {

      var self = this.findSelf();
      this.socket.emit('fire-bullet', {
        firedBy: this.id,
        angle: turretAngle
      });
      this.lastShotTime = time;
    }
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

Game.prototype.findSelf = function() {
  for (var i = 0; i < this.players.length; ++i) {
    if (this.players[i].id == this.id) {
      return this.players[i];
    }
  }
  return null;
};

Game.prototype.findPlayer = function(id) {
  for (var i = 0; i < this.players.length; ++i) {
    if (this.players[i].id == id) {
      return this.players[i];
    }
    return null;
  }
};

Game.prototype.receivePlayers = function(players) {
  this.players = players;
};

Game.prototype.receiveBullets = function(bullets) {
  this.bullets = bullets;
};

Game.prototype.receiveHealthPacks = function(healthpacks) {
  this.healthPacks = healthpacks;
};

Game.prototype.draw = function() {
  this.canvasContext.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);

  this.environment.draw();

  for (var i = 0; i < this.bullets.length; ++i) {
    this.drawing.drawBullet(
      this.viewPort.toCanvasCoords(this.bullets[i]),
      this.bullets[i].direction);
  }

  for (var i = 0; i < this.healthPacks.length; ++i) {
    this.drawing.drawHealthPack(
      this.viewPort.toCanvasCoords(this.healthPacks[i]));
  }

  // TODO: only render visible players
  var visiblePlayers = this.players;
  for (var i = 0; i < visiblePlayers.length; ++i) {
    this.drawing.drawTank(
      visiblePlayers[i].id == this.id,
      this.viewPort.toCanvasCoords(visiblePlayers[i]),
      visiblePlayers[i].orientation,
      visiblePlayers[i].turretAngle,
      visiblePlayers[i].name,
      visiblePlayers[i].health);
  }
};
