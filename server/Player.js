function Player(startX, startY) {
  this.x_ = startX;
  this.y_ = startY;
  this.id_ = null;
}

Player.prototype.getX = function() {
  return x_;
};

Player.prototype.getY = function() {
  return y_;
};

Player.prototype.getID = function() {
  return id_;
};

Player.prototype.setX = function(x) {
  x_ = x;
};

Player.prototype.setY = function(y) {
  y_ = y;
};

Player.prototype.setID = function(id) {
  this.id_ = id;
};

exports.Player = Player;
