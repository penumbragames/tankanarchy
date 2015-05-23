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
  var img = new Image();
  img.src = '../data/self_tank.png';
  this.context_.drawImage(img, -15, -25);
  this.context_.restore();
};

Drawing.prototype.drawOther = function(coords, orientation, turretAngle) {
  this.context_.save();
  this.context_.translate(coords[0], coords[1]);
  this.context_.rotate(orientation);
  var img = new Image();
  img.src = '../data/other_tank.png';
  this.context_.drawImage(img, -15, -25);
  this.context_.restore();
};
