/**
 * @fileoverview This file provides the necessary externs for the project when
 *   compiling with Google's Closure Compiler.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Socket.IO externs
 */

/**
 * @type {Function}
 */
function io() {}

/**
 * @param {string} name
 * @param {*} args
 */
io.prototype.emit = function(name, args) {};

/**
 * @param {string} event
 * @param {function(*)} handler
 */
io.prototype.on = function(event, handler) {};

/**
 * NodeJS module externs
 */

/**
 * @type {Object}
 */
var module = {};
