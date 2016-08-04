/**
 * Stores the state of a heat-seeking projectile on the server.
 * @author Kenneth Li <kennethli.3470@gmail.com>
 * @todo this needs to be rewritten to account for Projectile superclass.
 */

var Util = require('./Util').Util;

// TODO: implement this in heatseeker branch
function HeatSeeker(x, y, direction, target, firedBy) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.target = target;

  this.firedBy = firedBy;
  this.distanceTraveled = 0;
  this.shouldExist = true;
};

HeatSeeker.VELOCITY = 10;
HeatSeeker.TRAVEL_DISTANCE = 600;
HeatSeeker.COLLISION_DISTANCE = 25;

HeatSeeker.prototype.hit = function(player) {
  return Util.getManhattanDistance(this.x, this.y, player.x, player.y) <
    HeatSeeker.COLLISION_DISTANCE;
};

HeatSeeker.prototype.update = function(clients) {
  var delta_direction = this.direction - Math.atan2(this.target.y - this.y,
                                                     this.target.x - this.x);
  this.direction += Math.min(Math.PI * 0.5,
                             Math.max(Math.PI * 0.25, delta_direction / 2));

  this.x += Bullet.VELOCITY * Math.sin(this.direction);
  this.y += Bullet.VELOCITY * Math.cos(this.direction);
  this.distanceTraveled += Bullet.VELOCITY;

  if (this.distanceTraveled > Bullet.TRAVEL_DISTANCE) {
    this.shouldExist = false;
    return;
  }

  var players = clients.values();
  if (this.firedBy != players[i].id && this.hit(target)) {
      target.health -= 1;
      if (target.health <= 0) {
        var killingPlayer = clients.get(this.firedBy);
        killingPlayer.score++;
        clients.set(this.firedBy, killingPlayer);
      }
      this.shouldExist = false;
      return;
    }
  }
};

HeatSeeker.prototype.shouldExist = function() {
  return this.shouldExist;
};

module.exports = HeatSeeker;
