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

  this.socket_ = socket;

  this.id_ = null;
  this.lastShotTime_ = 0;
  this.players_ = [];
  this.bullets_ = [];
};

Game.WIDTH = 800;
Game.HEIGHT = 600;

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
    Input.MOUSE[1] - 300,
    Input.MOUSE[0] - 400) + Math.PI / 2;

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
    if (time > this.lastShotTime_ + 1000) {
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
  for (var i = 0; i < this.bullets_.length; ++i) {
    this.drawing_.drawBullet(
      this.viewPort_.toCanvasCoords(this.bullets_[i]),
      this.bullets_[i].direction_);
  }
  var visiblePlayers = getVisiblePlayers(this.players_);
  for (var i = 0; i < visiblePlayers; ++i) {
    if (this.players_[i].id_ == this.id_) {
      this.drawing_.drawSelf(
        this.viewPort_.toCanvasCoords(this.players_[i]),
        this.players_[i].orientation_,
        this.players_[i].turretAngle_, 
        this.players_[i].name_,
        this.players_[i].health_);
    } else {
      this.drawing_.drawOther(
        this.viewPort_.toCanvasCoords(this.players_[i]),
        this.players_[i].orientation_,
        this.players_[i].turretAngle_,
        this.players_[i].name_,
        this.players_[i].health_);
    }
  }
};
