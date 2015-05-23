/**
 * Class containing the game, handles drawing and updates.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Game(canvas, socket) {
  this.canvas_ = canvas;
  this.canvas_.width = Game.WIDTH;
  this.canvas_.height = Game.HEIGHT;
  this.canvasContext_ = this.canvas_.getContext('2d');

  this.socket_ = socket;

  this.id_ = null;
  this.players_ = [];
}

Game.WIDTH = 600;
Game.HEIGHT = 600;

Game.prototype.getCanvas = function() {
  return this.canvas_;
}

Game.prototype.getContext = function() {
  return this.canvasContext_;
}

Game.prototype.setID = function(id) {
  this.id_ = id;
}

Game.prototype.update = function() {
  if (KeyboardBuffer.UP || KeyboardBuffer.RIGHT ||
      KeyboardBuffer.DOWN || KeyboardBuffer.LEFT) {
    this.socket_.emit('move-player', {
      id: this.id_,
      keyboardState: {
        up: KeyboardBuffer.UP,
        right: KeyboardBuffer.RIGHT,
        down: KeyboardBuffer.DOWN,
        left: KeyboardBuffer.LEFT
      }
    });
  }
};

Game.prototype.receivePlayers = function(players) {
  this.players_ = players;
};

Game.prototype.draw = function() {
  this.canvasContext_.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
  for (var i = 0; i < this.players_.length; ++i) {
    if (this.players_[i].id_ == this.id_) {
      Drawing.drawSelf(this.canvasContext_, this.players_[i]);
    } else {
      Drawing.drawOther(this.canvasContext_, this.players_[i]);
    }
  }
};
