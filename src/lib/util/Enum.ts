/**
 * Helper functions for type enforcement for enums.
 * @author omgimanerd
 */

type EnumType = Record<string, string | number>

/**
 * Type enforcement identity function for declaring a constant object map whose
 * keys must be values in an enum type. Throws an error if the object contains
 * a key that is NOT an enum type.
 *
 * @param enumType The enum type to enforce keys for.
 * @param obj The constant object map to validate at compile time.
 * @returns obj
 */
export const LooseEnumMapping = <V>(
  enumType: EnumType,
  obj: Record<string, V>,
): Record<string, V> => {
  // Check that the object's keys are valid enum types.
  Object.keys(obj).forEach((key) => {
    if (!(key in enumType)) {
      throw new Error(
        `Object ${obj} contains key ${key} which is not in enum ${enumType}`,
      )
    }
  })
  return obj
}

/**
 * Type enforcement identity function for declaring a constant object map whose
 * keys must contain all the values in an enum. Throws an error if the given
 * object does not contain keys for all the values in enumType, or if the object
 * contains a key which is not in enumType.
 *
 * @param enumType The enum type to enforce keys for.
 * @param obj The constant object map to validate at compile time.
 * @returns obj
 */
export const StrictEnumMapping = <V>(
  enumType: EnumType,
  obj: Record<string, V>,
): Record<string, V> => {
  // Check that all the enum keys are also keys in the object.
  Object.keys(enumType).forEach((key) => {
    if (!(key in obj)) {
      throw new Error(`Object ${obj} does not contain required key ${key}`)
    }
  })
  return LooseEnumMapping<V>(enumType, obj)
}
