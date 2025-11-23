/**
 * Sound is a class encapsulating individual playable sound instances. It should
 * only ever be instantiated by cloning from the relevant SoundPrototype.
 * @author omgimanerd
 */

export default class Sound {
  sound: HTMLAudioElement

  looping: boolean = false
  played: boolean = false

  constructor(sound: HTMLAudioElement) {
    this.sound = sound
    this.bindListeners()
  }

  /**
   * To determine if the sound has finished playing, we bind a callback to
   * onended.
   */
  bindListeners() {
    this.sound.onended = () => {
      this.played = true
    }
  }

  play(volume: number = 0.2): Sound {
    this.volume = volume
    this.sound.play()
    return this
  }

  loop(volume: number = 0.2): Sound {
    this.volume = volume
    this.looping = true
    this.sound.loop = true
    this.sound.play()
    return this
  }

  pause(): Sound {
    this.sound.pause()
    return this
  }

  get volume(): number {
    return this.sound.volume
  }

  set volume(v: number) {
    this.sound.volume = v
  }
}
