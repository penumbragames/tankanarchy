/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 * Subordinate: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing(context) {
  this.context = context;
};

Drawing.SELF_TANK = '../data/self_tank.png';
Drawing.SELF_TURRET = '../data/self_turret.png';
Drawing.OTHER_TANK = '../data/other_tank.png';
Drawing.OTHER_TURRET = '../data/other_turret.png';
Drawing.BULLET = '../data/bullet.png';
Drawing.HEALTHPACK = '../data/healthPack.png';
Drawing.TILE = '../data/tile.png';

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
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.font = '14px Helvetica';
  this.context.textAlign = 'center';
  this.context.fillStyle = 'black';
  this.context.fillText(name, 0, -50);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  for (var i = 0; i < 10; i++) {
    if (i < health) {
      this.context.fillStyle = 'green';
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    } else {
      this.context.fillStyle = 'red';
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    }
  }     
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var tank = new Image();
  if (isSelf) {
    tank.src = Drawing.SELF_TANK;
  } else {
    tank.src = Drawing.OTHER_TANK;
  }
  this.context.drawImage(tank, -25, -30);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(turretAngle);
  var turret = new Image();
  if (isSelf) {
    turret.src = Drawing.SELF_TURRET;
  } else {
    turret.src = Drawing.OTHER_TURRET;
  }
  this.context.drawImage(turret, -25, -30);
  this.context.restore();
};

/** 
 * Draws a bullet.
 * @param {[number, number]} coords The coordinates of the center of the
 *   bullet.
 * @param {number} direction The direction of the bullet from 0 to 2 * PI
 */
Drawing.prototype.drawBullet = function(coords, direction) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(direction);
  var bullet = new Image();
  bullet.src = Drawing.BULLET;
  this.context.drawImage(bullet, -15, -15);
  this.context.restore();
}

/**
 * Draws a health pack.
 * @param {[number, number]} coords The coordinates of the center of the
 *   pack.
 */
Drawing.prototype.drawHealthPack = function(coords) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  var healthPack = new Image();
  healthPack.src = Drawing.HEALTHPACK;
  this.context.drawImage(healthPack, -15, -15);
  this.context.restore();
}

/**
 * Draws a background tile.
 * @param {[number, number]} coords The coordinates of the top left corner
 *   of the tile.
 */
Drawing.prototype.drawTiles = function(coords, edges) {
  this.context.save();
  var tile = new Image();
  tile.src = Drawing.TILE;
  for (var x = coords[0]; x < edges[0]; x += 100) {
    for (var y = coords[1]; y < edges[1]; y += 100) {
      this.context.drawImage(tile, x, y);
    }
  }
  this.context.restore();
}
