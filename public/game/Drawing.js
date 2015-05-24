/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 * Subordinate: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing(context) {
  this.context_ = context;
};

/**
 * Draws a tank to the canvas.
 * @param {boolean} isSelf Tells if I should draw a green tank (self)
 *   or a red tank (other player).
 * @param {[number, number]} coords The coordinates of the center of the
 *   tank.
 * @param {number} orientation The orientation of the tank from 0 to 2 * PI.
 * @param {number} turretAngle The angle of the turret from 0 to 2 * PI.
 * @param {string} name The name of the player associated with this tank.
 * @param {number} health The current health of the tank.
 */
Drawing.prototype.drawTank = function(isSelf, coords, orientation,
                                      turretAngle, name, health) {
  var context = this.context_;

  context.save();
  context.translate(coords[0], coords[1]);
  context.font = '14px Helvetica';
  context.textAlign = 'center';
  context.fillStyle = 'white';
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
  if (isSelf) {
    tank.src = '../data/self_tank.png';
  } else {
    tank.src = '../data/other_tank.png';
  }
  context.drawImage(tank, -25, -30);
  context.restore();

  context.save();
  context.translate(coords[0], coords[1]);
  context.rotate(turretAngle);
  var turret = new Image();
  if (isSelf) {
    turret.src = '../data/self_tank_turret.png';
  } else {
    turret.src = '../data/other_tank_turret.png';
  }
  context.drawImage(turret, -25, -30);
  context.restore();
};

/** 
 * Draws a bullet.
 * @param {[number, number]} coords The coordinates of the center of the
 *   bullet.
 * @param {number} direction The direction of the bullet from 0 to 2 * PI
 */
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

/**
 * Draws a texture tile.
 * @param {[number, number]} coords The coordinates of the top left corner
 *   of the tile.
 */
Drawing.prototype.drawTiles = function(coords) {
  var context = this.context_;
  
  context.save();
  var tile = new Image();
  tile.src = '../data/tile.png';

  for (var x = Math.min(coords[0], 0); x < Math.max(coords[0] + Game.WIDTH + 100, 10000); x += 100) {
    for (var y = Math.min(coords[1], 0); y < Math.max(coords[1] + Game.HEIGHT + 100, 10000); y += 100) {
      context.drawImage(tile, x, y);
    }
  }
  context.restore();
}
