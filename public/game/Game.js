/**
 * Class containing the game, handles drawing and updates.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Game(canvas, socket) {
  this.canvas_ = canvas;
  this.canvas_.width = Game.WIDTH;
  this.canvas_.height = Game.HEIGHT;
  this.canvasContext_ = this.canvas_.getContext('2d');

  this.drawing_ = new Drawing(this.canvasContext_);
  this.viewPort_ = new ViewPort();
  this.environment_ = new Environment(this.viewPort_, this.drawing_);

  this.socket_ = socket;

  this.id_ = null;
  this.lastShotTime_ = 0;
  this.players_ = [];
  this.bullets_ = [];
};

Game.WIDTH = 800;
Game.HEIGHT = 600;
Game.SHOOTING_INTERVAL = 800;

Game.prototype.getCanvas = function() {
  return this.canvas_;
};

Game.prototype.getContext = function() {
  return this.canvasContext_;
};

Game.prototype.getID = function() {
  return this.id_;
};

Game.prototype.getPlayers = function() {
  return this.players_;
};

Game.prototype.setID = function(id) {
  this.id_ = id;
  this.viewPort_.setID(id);
};

Game.prototype.update = function() {
  var self = this.findSelf();
  this.viewPort_.update(self.x_, self.y_);

  var turretAngle = Math.atan2(
    Input.MOUSE[1] - Game.HEIGHT / 2,
    Input.MOUSE[0] - Game.WIDTH / 2) + Math.PI / 2;

  this.socket_.emit('move-player', {
    id: this.id_,
    keyboardState: {
      up: Input.UP,
      right: Input.RIGHT,
      down: Input.DOWN,
      left: Input.LEFT
    },
    turretAngle: turretAngle
  });

  if (Input.CLICK) {
    var time = (new Date()).getTime();
    if (time > this.lastShotTime_ + Game.SHOOTING_INTERVAL) {
      var self = this.findSelf();
      this.socket_.emit('fire-bullet', {
        firedBy: this.id_,
        angle: turretAngle
      });
      this.lastShotTime_ = time;
    }
  }
};

Game.prototype.findSelf = function() {
  for (var i = 0; i < this.players_.length; ++i) {
    if (this.players_[i].id_ == this.id_) {
      return this.players_[i];
    }
  }
  return null;
};

Game.prototype.findPlayer = function(id) {
  for (var i = 0; i < this.players_.length; ++i) {
    if (this.players_[i].id_ == id) {
      return this.players_[i];
    }
    return null;
  }
};

Game.prototype.receivePlayers = function(players) {
  this.players_ = players;
};

Game.prototype.receiveBullets = function(bullets) {
  this.bullets_ = bullets;
};

Game.prototype.draw = function() {
  this.canvasContext_.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);

  this.environment_.draw();

  for (var i = 0; i < this.bullets_.length; ++i) {
    this.drawing_.drawBullet(
      this.viewPort_.toCanvasCoords(this.bullets_[i]),
      this.bullets_[i].direction_);
  }

  var visiblePlayers = this.players_;
  for (var i = 0; i < visiblePlayers.length; ++i) {
    this.drawing_.drawTank(
      visiblePlayers[i].id_ == this.id_,
      this.viewPort_.toCanvasCoords(visiblePlayers[i]),
      visiblePlayers[i].orientation_,
      visiblePlayers[i].turretAngle_, 
      visiblePlayers[i].name_,
      visiblePlayers[i].health_);
  }
};
