/**
 * Code necessary for the socket.io-client to work correctly, which involves
 * specifying custom Typescript interfaces for the socket communication, as well
 * as a custom parser and encoder for custom types.
 */

import * as Constants from '../lib/Constants'
import * as socketIO from 'socket.io-client'

import Emitter from 'component-emitter'

type ClientSocket = socketIO.Socket<
  Constants.SERVER_TO_CLIENT_EVENTS,
  Constants.CLIENT_TO_SERVER_EVENTS
>

/**
 * Custom encoder which allows for ES6 Maps to be serialized and deserialized
 * from JSON objects for sending across the wire through socket.io
 */
class Encoder {
  // eslint-disable-next-line class-methods-use-this
  encode(packet: string): string[] {
    return [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSON.stringify(packet, (_key: string, value: any) => {
        if (value instanceof Map) {
          return {
            type: 'Map',
            value: Array.from([...value]),
          }
        }
        return value
      }),
    ]
  }
}

class Decoder extends Emitter {
  // eslint-disable-next-line class-methods-use-this
  add(chunk: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const packet = JSON.parse(chunk, (_key: string, value: any) => {
      if (value && typeof value === 'object') {
        if (value.dataType === 'Map') {
          return new Map(value.value)
        }
      }
    })
    this.emit('decoded', packet)
  }
}

const getClientSocket = (): ClientSocket =>
  socketIO.io({
    parser: {
      Encoder,
      Decoder,
    },
  })

export { ClientSocket, getClientSocket }
