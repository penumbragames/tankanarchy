/**
 * Reloads the page if the player has been afk for more than 1 minute.
 * This essentially kicks them from the game since it will fire the socket
 * disconnect event.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the AFK_Kicker kicker class.
 * @constructor
 */
function AFK_Kicker() {
  this.timer = null;
}

/**
 * AFK_Kicker kicker constants.
 */
AFK_Kicker.KICK_TIME = 120000;

/**
 * Initializes the AFK_Kicker kicker, must be called when the game starts.
 */
AFK_Kicker.prototype.init = function() {
  this.timer = (new Date).getTime();
  window.addEventListener('click', this.resetTimer);
  window.addEventListener('mousemove', this.resetTimer);
  window.addEventListener('keydown', this.resetTimer);
};

/**
 * Checks the timer and reloads the page if the player is determined
 * to be AFK_Kicker.
 */
AFK_Kicker.prototype.check = function() {
  if ((new Date).getTime() > this.timer + AFK_Kicker.KICK_TIME) {
    location.reload();
  }
};

/**
 * Resets the AFK_Kicker kick timer. Bound to click and key actions so that
 * the player will reset the timer whenever they move or shoot.
 */
AFK_Kicker.prototype.resetTimer = function() {
  this.timer = (new Date).getTime();
};
