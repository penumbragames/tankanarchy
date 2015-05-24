/**
 * Reloads the page if the player has been afk for more than 1 minute.
 */

function AFK() {}

AFK.TIMER = 0;
AFK.KICK_TIME = 120000;

AFK.init = function() {
  AFK.TIMER = (new Date).getTime();
  window.addEventListener('click', AFK.resetTimer);
  window.addEventListener('keydown', AFK.resetTimer);
};

AFK.check = function() {
  if ((new Date).getTime() > AFK.TIMER + AFK.KICK_TIME) {
    location.reload();
  }
};

AFK.resetTimer = function() {
  AFK.TIMER = (new Date).getTime();
};
