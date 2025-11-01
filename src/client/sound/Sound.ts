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

  get volume() {
    return this.sound.volume
  }

  set volume(volume: number) {
    this.sound.volume = volume
  }

  play() {
    ;(<HTMLAudioElement>this.sound.cloneNode()).play()
  }
}
