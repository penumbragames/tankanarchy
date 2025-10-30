/**
 * @fileoverview Returns a JSON replacer and reviver function that allows for
 * registered classes to be serialized and deserialized from JSON objects.
 */

import 'reflect-metadata'

import { instanceToPlain, plainToInstance } from 'class-transformer'

const __type__ = '__type__'

type SerializableTypes = {
  [key: string]: any
}

interface JSONReplacerReviver {
  replacer: (this: any, key: string, value: any) => any
  reviver: (this: any, key: string, value: any) => any
}

/**
 * Given an object containing the classes to be serialized/deserialized, this
 * function returns a replacer and reviver function that can be used with
 * JSON.stringify and JSON.parse which will allow for the classes to be
 * serialized into a JSON object and deserialized back into an instance of
 * themselves.
 *
 * The classes must not have a __type__ property defined since this will be
 * written into the object in order to preserve type information.
 *
 * @param types An object specifying the classes that the custom serialization
 * logic will apply to, best specified using the object shorthand notation as {
 * Class1, Class2 }.
 * @returns JSONReplacerReviver, an object with two keys storing the custom
 * replacer and reviver functions to be used with JSON.parse and JSON.stringify
 */
export function getReplacerReviver(
  types: SerializableTypes,
): JSONReplacerReviver {
  return {
    replacer(_key: string, value: any): any {
      if (!value) return value
      if (Object.prototype.hasOwnProperty.call(value, __type__)) {
        throw new Error(
          'Objects to be serialized cannot have a __typename__ property',
        )
      }
      // Fetch the object instance name if available and check if it is in the
      // list of special serializable types that we need to handle with
      // class-transformer.
      const className = value?.constructor?.name
      if (
        !className ||
        !(className in types) ||
        !(value instanceof types[className])
      )
        return value
      // If so, serialize it with class-transformer's instanceToPlain and write
      // the type into the __type__ field.
      const plainObject = instanceToPlain(value)
      Object.defineProperty(plainObject, __type__, {
        value: className,
        enumerable: true,
      })
      return plainObject
    },
    reviver(_key: string, value: any): any {
      if (!value) return value
      // Check if the object to deserialize has a __type__ field, with a
      // __type__ that is registered.
      const typenameProperty = Object.getOwnPropertyDescriptor(value, __type__)
      if (!typenameProperty || !typenameProperty.value) return value
      if (!(typenameProperty.value in types)) {
        throw new Error(
          `Object to deserialize has a __type__ field with an unknown type ${typenameProperty.value}`,
        )
      }
      // Remove the __type__ field and deserialize it with class-transformer's
      // plainToInstance.
      delete value[__type__]
      return plainToInstance(types[typenameProperty.value], value)
    },
  }
}
