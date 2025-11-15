/**
 * Global store of sound objects on the client side to be used for playback.
 * @author omgimanerd
 */

import SOUNDS from 'lib/enums/Sounds'

import Sound from 'client/sound/Sound'
import { StrictEnumMapping } from 'lib/enums/EnumMapping'

// Populated asynchronously
let SOUND_MAP: Record<SOUNDS, Sound> = {} as Record<SOUNDS, Sound>

const loadSound = async (soundEnum: SOUNDS, src: string) => {
  SOUND_MAP[soundEnum] = await Sound.create(src)
}

/**
 * Asynchronously loads all the required sound assets for the game, must be
 * called during site load prior to game initialization.
 */
export const loadSounds = async () => {
  await Promise.all([
    loadSound(SOUNDS.EXPLOSION, '/sound/boom.mp3'),
    loadSound(SOUNDS.GUN_POWERUP, '/sound/gunPowerup.wav'),
    loadSound(SOUNDS.HEALTH_PACK, '/sound/healthpack.mp3'),
    loadSound(SOUNDS.TANK_SHOT, '/sound/tankShot.mp3'),
  ])
  StrictEnumMapping<Sound>(SOUNDS, SOUND_MAP)
}

export default SOUND_MAP
