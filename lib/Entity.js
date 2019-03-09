/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

// Vector Math
var add = require('vectors/add')(2);
var copy = require('vectors/copy')(2);
var div = require('vectors/div')(2);
var mult = require('vectors/mult')(2);

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {Array.<number>} position The position vector of this Entity.
 * @param {Array.<number>} velocity The velocity vector of this Entity.
 * @param {Array.<number>} acceleration The acceleration vector of this Entity.
 * @param {number} mass The mass of this entity.
 */
function Entity(position, velocity, acceleration, mass) {
  this.position = position || [0, 0];
  this.velocity = velocity || [0, 0];
  this.velocityDifference = [0, 0];
  this.acceleration = acceleration || [0, 0];
  this.accelerationDifference = [0, 0];

  this.mass = mass || 1;

  this.lastUpdateTime = 0;
  this.updateTimeDifference = 0;
}

/**
 * Returns true if this entity is visible to the given player.
 * @param {Player} player The player to check visibility to.
 * @return {boolean}
 */
Entity.prototype.isVisibleTo = function(player) {
  return Util.inBound(
      this.getX(),
      player.getX() - Constants.VISIBILITY_THRESHOLD_X,
      player.getX() + Constants.VISIBILITY_THRESHOLD_X) && Util.inBound(
      this.getY(),
      player.getY() - Constants.VISIBILITY_THRESHOLD_Y,
      player.getY() + Constants.VISIBILITY_THRESHOLD_Y);
};

/**
 * Updates the entity's position based on its velocity according to
 * the amount of time the passed between this update and the last
 * update.
 */
Entity.prototype.update = function() {
  var currentTime = (new Date()).getTime();
  if (this.lastUpdateTime == 0) {
    this.updateTimeDifference = 0;
  } else {
    this.updateTimeDifference = currentTime - this.lastUpdateTime;
  }
  this.velocityDifference = mult(
      copy(this.velocity), this.updateTimeDifference / 1000);
  add(this.position, this.velocityDifference);
  console.log(this.position, this.velocity);
  this.lastUpdateTime = currentTime;
};

/**
 * Applies a force to this Entity.
 * @param {Array.<number>} force The force to apply.
 */
Entity.prototype.applyForce = function(force) {
  add(this.acceleration, div(force, this.mass));
};

/**
 * Returns the x coordinate of this Entity.
 * @return {number}
 */
Entity.prototype.getX = function() {
  return this.position[0];
};

/**
 * Returns the y coordinate of this Entity.
 * @return {number}
 */
Entity.prototype.getY = function() {
  return this.position[1];
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Entity;
