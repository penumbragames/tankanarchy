/**
 * Wrapper class for the native JS sound objects.
 * @author omgimanerd
 */

export default class Sound {
  sound: HTMLAudioElement

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
  }

  static create(src: string): Sound {
    const sound = new Audio()
    sound.src = src
    return new Sound(sound)
  }

  play(volume: number = 0.2) {
    const clone: HTMLAudioElement = <HTMLAudioElement>this.sound.cloneNode()
    clone.volume = volume
    clone.play()
  }
}
