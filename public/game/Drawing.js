/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing() {}

Drawing.drawSelf = function(game, context, object) {
  context.save();
  var translatedCoords = ViewPort.toCanvasCoords(game, object);
  context.translate(translatedCoords[0], translatedCoords[1]);
  context.rotate(object.orientation_);
  var img = new Image();
  img.src = '../data/self_tank.png';
  context.drawImage(img, -15, -25);
  context.restore();
};

Drawing.drawOther = function(game, context, object) {
  context.save();
  var translatedCoords = ViewPort.toCanvasCoords(game, object);
  context.translate(translatedCoords[0], translatedCoords[1]);
  context.rotate(object.orientation_);
  var img = new Image();
  img.src = '../data/other_tank.png';
  context.drawImage(img, -15, -25);
  context.restore();
};
