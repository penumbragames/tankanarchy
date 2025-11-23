/**
 * @fileoverview Custom extensions of of socket.io's built in encoder and
 * decoder that use our replacer and reviver to send objects across the socket
 * and fully deserialize them back. Uses JSON.stringify and JSON.parse, which
 * is sufficient because we do not send binary or other data over the socket.
 *
 * We explicitly override the functionality of socket.io's built in parser
 * because even if the provided replacer/reviver functions handle circular
 * references, the built in parser performs other checks that result in a stack
 * overflow.
 *
 * Specifically, the isBinary() check in the built in parser will fail if given
 * an object with a circular reference. Since we are not sending binary data
 * over socket, we can simply override both the Encoder and Decoder class to
 * skip all of these checks and optimizations and use JSON.parse/stringify with
 * our custom replacer and reviver function.
 *
 * @author omgimanerd
 */

import * as socketIOParser from 'socket.io-parser'

import { replacer, reviver } from 'lib/serialization/ReplacerReviver'

/**
 * Subclass of the default socket-io.parser encoder that uses our custom
 * replacer function to serialize objects.
 */
class Encoder extends socketIOParser.Encoder {
  override encode(packet: socketIOParser.Packet) {
    return [JSON.stringify(packet, replacer)]
  }
}

/**
 * Subclass of the default socket-io.parser decoder that uses our custom reviver
 * function to deserialize data back into the original object.
 */
class Decoder extends socketIOParser.Decoder {
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
