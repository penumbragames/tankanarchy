/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing(context) {
  this.context_ = context;
};

Drawing.prototype.drawTank = function(isSelf, coords, orientation, turretAngle, name, health) {

  var context = this.context_;

  context.save();
  context.translate(coords[0], coords[1]);
  context.font = '14px Helvetica';
  context.textAlign = 'center';
  if (isSelf)
    context.fillStyle = 'green';
  else
    context.fillStyle = 'red';
  context.fillText(name, 0, -50);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  for (var i = 0; i < 10; i++) {
    if (i < health) {
      context.fillStyle = 'green';
      context.fillRect(-25 + 5 * i, -42, 5, 4);
    } else {
      context.fillStyle = 'red';
      context.fillRect(-25 + 5 * i, -42, 5, 4);
    }
  }     
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(orientation);
  var tank = new Image();
  if (isSelf)
    tank.src = '../data/self_tank.png';
  else
    tank.src = '../data/other_tank.png';
  context.drawImage(tank, -25, -30);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(turretAngle);
  var turret = new Image();
  if (isSelf)
    turret.src = '../data/self_tank_turret.png';
  else
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
