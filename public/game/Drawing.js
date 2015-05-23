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
  this.context_.drawImage(tank, -25, -30);
  this.context_.restore();

  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/self_tank_turret.png';
  this.context_.drawImage(turret, -25, -30);
  this.context_.restore();
};

Drawing.prototype.drawOther = function(coords, orientation, turretAngle) {
  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(orientation);
  var tank = new Image();
  tank.src = '../data/other_tank.png';
  this.context_.drawImage(tank, -25, -30);
  this.context_.restore();

  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/other_tank_turret.png';
  this.context_.drawImage(turret, -25, -30);
  this.context_.restore();
};

Drawing.prototype.drawBullet = function(coords, orientation) {
  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(orientation);
  var bullet = new Image();
  bullet.src = '../data/bullet.png';
  this.context_.drawImage(bullet, -15, -15);
  this.context_.restore();
}
