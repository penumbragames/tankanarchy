/**
 * SoundPrototype is a class encapsulating each sound asset one to one. It acts
 * as the prototype class from which playable sound instances are cloned from.
 * Instances of SoundPrototype should only be async initialized during game
 * initialization.
 * @author omgimanerd
 */

import loadResource from 'client/lib/ResourceLoader'
import Sound from 'client/sound/Sound'

export default class SoundPrototype {
  private sound: HTMLAudioElement

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
  }

  /**
   * Static factory method for a SoundPrototype that performs the network
   * request to fetch the sound asset.
   * @param src the path to the sound asset
   * @returns a promise containing the SoundPrototype
   */
  static async create(src: string): Promise<SoundPrototype> {
    return new SoundPrototype(await loadResource(Audio, src))
  }

  clone(): Sound {
    return new Sound(<HTMLAudioElement>this.sound.cloneNode())
  }

  /**
   * Playing this sound returns an instance of Sound, the playable instance
   * class. The underlying audio element for the sound prototype should not ever
   * be modified or played.
   * @param volume The volume to play the audio asset at
   * @returns The Sound instance cloned from this prototype
   */
  play(volume: number = 0.2): Sound {
    return this.clone().play(volume)
  }
}
