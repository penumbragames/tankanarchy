/**
 * Stores the state of a heat-seeking projectile on the server.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 */

function HeatSeeker(x, y, direction, target, firedBy) {
  this.x_ = x;
  this.y_ = y;
  this.direction_ = direction;
  this.target_ = target;
  this.firedBy_ = firedBy;
  this.distanceTraveled_ = 0;
  this.shouldExist_ = true;
};

HeatSeeker.VELOCITY = 10;
HeatSeeker.TRAVEL_DISTANCE = 600;
HeatSeeker.COLLISION_DISTANCE = 25;

HeatSeeker.prototype.hit = function(player) {
  return Math.abs(player.x_ - this.x_) + Math.abs(player.y_ - this.y_) <
    HeatSeeker.COLLISION_DISTANCE;
};

HeatSeeker.prototype.update = function(clients) {
  var delta_direction = this.direction_ - Math.atan2(this.target_.y_ - this.y_, 
                                                     this.target_.x_ - this.x_);
  this.direction_ += Math.min(Math.PI * 0.5, Math.max(Math.PI * 0.25, delta_direction / 2));
  
  this.x_ += Bullet.VELOCITY * Math.sin(this.direction_);
  this.y_ += Bullet.VELOCITY * Math.cos(this.direction_);
  this.distanceTraveled_ += Bullet.VELOCITY;

  if (this.distanceTraveled_ > Bullet.TRAVEL_DISTANCE) {
    this.shouldExist_ = false;
    return;
  }

  var players = clients.values();
  if (this.firedBy_ != players[i].id_ && this.hit(target_)) {
      target_.health -= 1;
      if (target_.health_ <= 0) {
        var killingPlayer = clients.get(this.firedBy_);
        killingPlayer.score_++;
        clients.set(this.firedBy_, killingPlayer);
      }
      this.shouldExist_ = false;
      return;
    }
  }
};

HeatSeeker.prototype.shouldExist = function() {
  return this.shouldExist_;
};

exports.HeatSeeker = HeatSeeker;
