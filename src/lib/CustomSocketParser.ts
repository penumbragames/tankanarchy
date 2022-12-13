/**
 * @fileoverview Custom JSON replacer and reviver functions which allow for ES6
 * Maps to be serialized and deserialized from JSON objects for sending across
 * the wire through socket.io.
 */

import * as socketIOParser from 'socket.io-parser'

/**
 * The enum names and their string values must exactly match each other because
 * this will be sent across the wire as JSON.
 */
enum CustomSerializableType {
  MAP = 'MAP',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CustomSerializationObject {
  datatype: CustomSerializableType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}
function replacer(_key: string, value: any): any | CustomSerializationObject {
  if (value.datatype) {
    throw new Error(
      'Objects that are sent through socket.io cannot have a datatype field',
    )
  }
  if (value instanceof Map) {
    /**
     * The usage of datatype as a field name in the custom data object means
     * 'datatype' cannot be used as a field name anywhere else in any other
     * object that will be serialized or deserialized across the wire.
     */
    return {
      datatype: CustomSerializableType.MAP,
      value: Array.from(value.entries()),
    }
  }
  return value
}
function reviver(_key: string, value: any): any {
  if (value && typeof value === 'object' && value.datatype && value.value) {
    const cast = <CustomSerializationObject>value
    if (cast.datatype === CustomSerializableType.MAP) {
      return new Map(value.value)
    }
  }
  return value
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class Encoder extends socketIOParser.Encoder {
  constructor() {
    super(replacer)
  }
}

export class Decoder extends socketIOParser.Decoder {
  constructor() {
    super(reviver)
  }
}
