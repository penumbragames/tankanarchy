/**
 * Sound playing class encapsulating each sound asset one to one.
 * @author omgimanerd
 */

import loadResource from 'client/lib/ResourceLoader'

/**
 * Sound acts as a sound player for each individual playing sound. The
 * prototype instance which is created at game initialization performs the
 * network request to fetch the sound asset. During the game, all sound actions
 * should clone the prototype.
 */
export default class Sound {
  sound: HTMLAudioElement
  played: boolean = false

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
    this.bindListeners()
  }

  /**
   * This should only be called once at game initialization to set up the
   * global sound prototypes. All sound playing should clone the prototypes to
   * play a sound.
   * @param src path to the sound asset
   * @returns a promise containing the wrapped Sound
   */
  static async create(src: string): Promise<Sound> {
    return new Sound(await loadResource(Audio, src))
  }

  bindListeners() {
    this.sound.onended = () => {
      this.played = true
    }
  }

  clone(): Sound {
    return new Sound(<HTMLAudioElement>this.sound.cloneNode())
  }

  play(volume: number = 0.2): Sound {
    const clone = this.clone()
    clone.sound.volume = volume
    clone.sound.play()
    return clone
  }

  // Calling any of the methods below this line on the global sound prototype
  // will result in it fucking with all further cloned sound instances.

  pause(): void {
    this.sound.pause()
  }

  get volume(): number {
    return this.sound.volume
  }

  set volume(v: number) {
    this.sound.volume = v
  }
}
