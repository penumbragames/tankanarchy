/**
 * Global store of sound objects on the client side to be used for playback.
 * @author omgimanerd
 */

import Sound from 'client/sound/Sound'
import SOUNDS from 'lib/sound/Sounds'
import { StrictEnumMapping } from 'lib/util/Enum'

export const EXPLOSION = Sound.create('/sound/boom.mp3')
export const GUN_POWERUP = Sound.create('/sound/gunPowerup.wav')
export const HEALTH_PACK = Sound.create('sound/healthpack.mp3')
export const TANK_SHOT = Sound.create('/sound/tankShot.mp3')

export const SOUND_MAPPING = StrictEnumMapping<Sound>(SOUNDS, {
  [SOUNDS.EXPLOSION]: EXPLOSION,
  [SOUNDS.GUN_POWERUP]: GUN_POWERUP,
  [SOUNDS.HEALTH_PACK]: HEALTH_PACK,
  [SOUNDS.TANK_SHOT]: TANK_SHOT,
})
