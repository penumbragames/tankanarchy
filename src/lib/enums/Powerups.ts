/**
 * @author omgimanerd
 */

// Cannot be a const enum because we iterate over it.
enum POWERUPS {
  HEALTH_PACK = 'HEALTH_PACK',
  LASER = 'LASER',
  RAPIDFIRE = 'RAPIDFIRE',
  ROCKET = 'ROCKET',
  SHIELD = 'SHIELD',
  SHOTGUN = 'SHOTGUN',
  SPEEDBOOST = 'SPEEDBOOST',
}

export default POWERUPS
