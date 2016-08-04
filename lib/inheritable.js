/**
 * This file is needed as a dependency for any class that extends another class.
 * Since we are extending the Function wrapper class, we do not need a module
 * export.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * This extension of the Function class allows for class inheritance.
 * Example usage:
 * require('./inheritable');
 * Player.inheritsFrom(Entity);
 * @param {Object} parent The parent element that the current object will
 *   inherit from.
 * @return {Object}
 */
Function.prototype.inheritsFrom = function(parent) {
  this.prototype = new parent();
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
  return this;
};
