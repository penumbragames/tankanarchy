
function Player(x, y, name) {
  this.x_ = x;
  this.y_ = y;
  this.name_ = name;
};

Player.prototype.getX = function() {
  return this.x_;
};

Player.prototype.getY = function() {
  return this.y_;
};

Player.prototype.getName = function() {
  return this.name_;
};

Player.prototype.setX = function(x) {
  this.x_ = x;
  return this;
};

Player.prototype.setY = function(y) {
  this.y_ = y;
  return this;
};

Player.prototype.setName = function(name) {
  this.name_ = name;
  return this;
};

exports.Player = Player;
