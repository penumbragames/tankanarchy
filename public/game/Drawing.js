/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing(context) {
  this.context_ = context;
};

Drawing.prototype.drawSelf = function(coords, orientation, turretAngle, name, health) {

  var context = this.context_;

  context.save();
  context.translate(coords[0], coords[1]);
  context.font = '14px Helvetica';
  context.textAlign = 'center';
  context.fillStyle = 'green';
  context.fillText(name, 0, -40);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(orientation);
  var tank = new Image();
  tank.src = '../data/self_tank.png';
  context.drawImage(tank, -25, -30);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/self_tank_turret.png';
  context.drawImage(turret, -25, -30);
  context.restore();

};

Drawing.prototype.drawOther = function(coords, orientation, turretAngle, name, health) {

  var context = this.context_;

  context.save();
  context.translate(coords[0], coords[1]);
  context.font = '14px Helvetica';
  context.textAlign = 'center';
  context.fillStyle = 'red';
  context.fillText(name, -25, -40);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(orientation);
  var tank = new Image();
  tank.src = '../data/other_tank.png';
  context.drawImage(tank, -25, -30);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(turretAngle);
  var turret = new Image();
  turret.src = '../data/other_tank_turret.png';
  context.drawImage(turret, -25, -30);
  context.restore();

};

Drawing.prototype.drawBullet = function(coords, direction) {

  var context = this.context_;

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(direction);
  var bullet = new Image();
  bullet.src = '../data/bullet.png';
  context.drawImage(bullet, -15, -15);
  context.restore();

}
