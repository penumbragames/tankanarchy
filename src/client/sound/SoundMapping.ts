/**
 * Global store of sound objects on the client side to be used for playback.
 * @author omgimanerd
 */

import Sound from 'client/sound/Sound'
import SOUNDS from 'client/sound/Sounds'

export const EXPLOSION = Sound.create('/sound/explosion.mp3')
export const TANK_SHOT = Sound.create('/sound/tankShot.mp3')

export const SOUND_MAPPING = {
  [SOUNDS.EXPLOSION]: EXPLOSION,
  [SOUNDS.TANK_SHOT]: TANK_SHOT,
}
