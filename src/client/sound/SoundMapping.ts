/**
 * Global store of sound objects on the client side to be used for playback.
 * @author omgimanerd
 */

import Sound from 'client/sound/Sound'
import SOUNDS from 'lib/sound/Sounds'

export const EXPLOSION = Sound.create('/sound/boom.mp3')
export const GUN_POWERUP = Sound.create('/sound/gunPowerup.wav')
export const HEALTH_PACK = Sound.create('sound/healthpack.mp3')
export const TANK_SHOT = Sound.create('/sound/tankShot.mp3')

type SOUND_MAPPING_TYPE = {
  [key: string]: Sound
}

export const SOUND_MAPPING: SOUND_MAPPING_TYPE = {
  // this is actually a string
  [SOUNDS.EXPLOSION]: EXPLOSION,
  [SOUNDS.GUN_POWERUP]: GUN_POWERUP,
  [SOUNDS.HEALTH_PACK]: HEALTH_PACK,
  [SOUNDS.TANK_SHOT]: TANK_SHOT,
}
