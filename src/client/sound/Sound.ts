/**
 * Wrapper class for the native JS sound objects.
 * @author omgimanerd
 */

import loadResource from 'client/lib/ResourceLoader'

export default class Sound {
  sound: HTMLAudioElement

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
  }

  static async create(src: string): Promise<Sound> {
    return new Sound(await loadResource(Audio, src))
  }

  play(volume: number = 0.2) {
    const clone: HTMLAudioElement = <HTMLAudioElement>this.sound.cloneNode()
    clone.volume = volume
    clone.play()
  }
}
