/**
 * @fileoverview Custom JSON replacer and reviver functions which allow for ES6
 * Maps to be serialized and deserialized from JSON objects for sending across
 * the wire through socket.io.
 */

import * as socketIOParser from 'socket.io-parser'

/**
 * The enum names and their string values must exactly match each other because
 * this will be sent across the wire as JSON. This enum contains the custom data
 * types that we will write custom encoding logic.
 */
enum CustomSerializableTypes {
  MAP = 'MAP',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This interface defines the object that will be sent across the wire in place
 * of any object that cannot be serialized normally.
 */
interface CustomSerializationObject {
  datatype: CustomSerializableTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

/**
 * Subclass of the default socket-io.parser encoder that can be used as a
 * drop-in replacement.
 */
export class Encoder extends socketIOParser.Encoder {
  constructor() {
    super(Encoder.replacer)
  }

  /**
   * Custom replacer function that is passed into JSON.stringify in order to
   * transform types that we specify in CustomSerializableTypes.
   */
  static replacer(_key: string, value: any): any | CustomSerializationObject {
    /**
     * The usage of datatype as a field name in the custom data object means
     * 'datatype' cannot be used as a field name anywhere else in any other
     * object that will be serialized or deserialized across the wire.
     */
    if (value.datatype) {
      throw new Error(
        'Objects that are sent through socket.io cannot have a datatype field',
      )
    }
    if (value instanceof Map) {
      return {
        datatype: CustomSerializableTypes.MAP,
        value: Array.from(value.entries()),
      }
    }
    return value
  }
}

/**
 * Subclass of the default socket-io.parser decoder that can be used as a
 * drop-in replacement.
 */
export class Decoder extends socketIOParser.Decoder {
  constructor() {
    super(Decoder.reviver)
  }

  /**
   * Custom reviver function that is passed into JSON.parse to deserialize the
   * CustomSerializationObject back into the original type.
   */
  static reviver(_key: string, value: any): any {
    if (value && typeof value === 'object' && value.datatype && value.value) {
      const cast = <CustomSerializationObject>value
      if (cast.datatype === CustomSerializableTypes.MAP) {
        return new Map(value.value)
      }
    }
    return value
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
