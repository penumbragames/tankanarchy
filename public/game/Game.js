function Game() {
  this.canvas_ = document.getElementById('canvas');
  this.canvasContext_ = this.canvas_.getContext('2d');
  this.player_ = null;
  this.remote_players = [];
}

Game.prototype.getCanvas = function() {
  return this.canvas_;
}

Game.prototype.getContext = function() {
  return this.canvasContext_;
}

Game.prototype.getPlayer = function() {
  return this.player_;
}

Game.prototype.setPlayer = function(player) {
  this.player_ = player;
  return this;
}

Game.prototype.update = function() {
  this.canvasContext_.clearRect(0, 0,
                                this.canvas_.width, this.canvas_.height);
  this.player_.update();
};

Game.prototype.draw = function() {
  this.player_.draw(this.canvasContext_);
}

