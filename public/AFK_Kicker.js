/**
 * Reloads the page if the player has been afk for more than 1 minute.
 * This essentially kicks them from the game since it will fire the socket
 * disconnect event.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the AFK kicker class.
 * @constructor
 */
function AFK() {
  this.timer = null;
}

/**
 * AFK kicker constants.
 */
AFK.KICK_TIME = 120000;

/**
 * Initializes the AFK kicker, must be called when the game starts.
 */
AFK.prototype.init = function() {
  this.timer = (new Date).getTime();
  window.addEventListener('click', this.resetTimer);
  window.addEventListener('mousemove', this.resetTimer);
  window.addEventListener('keydown', this.resetTimer);
};

/**
 * Checks the timer and reloads the page if the player is determined
 * to be AFK.
 */
AFK.prototype.check = function() {
  if ((new Date).getTime() > this.timer + AFK.KICK_TIME) {
    location.reload();
  }
};

/**
 * Resets the AFK kick timer. Bound to click and key actions so that
 * the player will reset the timer whenever they move or shoot.
 */
AFK.prototype.resetTimer = function() {
  this.timer = (new Date).getTime();
};
