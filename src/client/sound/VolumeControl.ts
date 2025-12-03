/**
 * Class to populate the settings container with a volume control slider.
 * @author omgimanerd
 */

import Dom from 'client/ui/Dom'

export default class VolumeControl {
  static readonly MAX = 100
  static readonly MIN = 0

  static instance: VolumeControl

  container: HTMLElement

  _volume: number = 0 // getter scales the volume correctly from 0 to 1

  constructor(container: HTMLElement) {
    this.container = container
  }

  /**
   * Initializes the singleton class given the container for the volume control.
   * Builds the DOM elements for the volume slider.
   * @param containerId The ID of the settings container.
   */
  static init(containerId: string): void {
    const container = document.getElementById(containerId)!
    const savedVolume = localStorage.getItem('volume') ?? '50'
    VolumeControl.instance = new VolumeControl(container)
    VolumeControl.instance._volume = parseInt(savedVolume, 10)

    const label = document.createElement('label')
    container.appendChild(label)

    const icon = Dom.createElement('img', {
      src: '/img/volume.png',
    })
    label.appendChild(icon)

    const slider = Dom.createElement('input', {
      id: 'volume-slider',
      type: 'range',
      min: VolumeControl.MIN.toString(),
      max: VolumeControl.MAX.toString(),
      step: '1',
      value: savedVolume,
      onchange: (e: Event) => {
        const volume = (<HTMLInputElement>e.target).value
        VolumeControl.instance._volume = parseInt(volume, 10)
        localStorage.setItem('volume', volume)
        if (volume === '0') {
          icon.src = '/img/volume_mute.png'
        } else {
          icon.src = '/img/volume.png'
        }
      },
    })
    container.appendChild(slider)
  }

  static get(): VolumeControl {
    if (VolumeControl.instance === undefined) {
      throw new Error('VolumeControl singleton has not been initialized.')
    }
    return VolumeControl.instance
  }

  get volume() {
    return this._volume / VolumeControl.MAX
  }
}
