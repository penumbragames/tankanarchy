/**
 * Useful typescript type constructs.
 * @author omgimanerd
 */

export type Ref<T> = T

export type Constructor<T> = new (...args: any[]) => T

export type Nullable<T> = T | null
