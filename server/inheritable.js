/**
 * This file is needed as a dependency for any class that extends another class.
 * Since we are extending the Function wrapper class, we do not need a module
 * export.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

Function.prototype.inheritsFrom = function(parent) {
  this.prototype = new parent();
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
  return this;
};
