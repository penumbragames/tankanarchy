/**
 * @fileoverview Custom extensions of of socket.io's built in encoder and
 * decoder that use our replacer and reviver to send objects across the socket
 * and fully deserialize them back. Uses JSON.stringify and JSON.parse, which
 * is sufficient because we do not send binary or other data over the socket.
 * @author omgimanerd
 */

import * as socketIOParser from 'socket.io-parser'

import { replacer, reviver } from 'lib/serialization/ReplacerReviver'

/**
 * Subclass of the default socket-io.parser encoder that can be used as a
 * drop-in replacement.
 */
class Encoder extends socketIOParser.Encoder {
  constructor() {
    super(replacer)
  }

  override encode(packet: socketIOParser.Packet) {
    return [JSON.stringify(packet, replacer)]
  }
}

/**
 * Subclass of the default socket-io.parser decoder that can be used as a
 * drop-in replacement.
 */
class Decoder extends socketIOParser.Decoder {
  constructor() {
    super(reviver)
  }

  override add(chunk: string) {
    try {
      this.emitReserved('decoded', JSON.parse(chunk, reviver))
    } catch (error: unknown) {
      console.error(error)
    }
  }
}

export default {
  Encoder,
  Decoder,
}
