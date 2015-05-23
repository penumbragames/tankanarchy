/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing(context) {
  this.context_ = context;
};

Drawing.prototype.drawSelf = function(coords, orientation, turretAngle) {
  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(orientation);
  var tank = new Image();
  tank.src = '../data/self_tank.png';
  this.context_.drawImage(tank, -15, -25);
  this.context_.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/self_tank_turret.png';
  this.context_.drawImage(turret, -15, -25);
  this.context_.restore();
};

Drawing.prototype.drawOther = function(coords, orientation, turretAngle) {
  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(orientation);
  var tank = new Image();
  tank.src = '../data/other_tank.png';
  this.context_.drawImage(tank, -15, -25);
  this.context_.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/other_tank_turret.png';
  this.context_.drawImage(turret, -15, -25);
  this.context_.restore();
};
