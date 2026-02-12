// Stub type definitions for zustand

type SetState<T> = (
  fn: ((state: T) => Partial<T> | T) | Partial<T>,
  replace?: boolean
) => void;

type GetState<T> = () => T;

type StateCreator<T> = (
  set: SetState<T>,
  get: GetState<T>,
  store?: any
) => T;

declare module 'zustand' {
  export function create<T>(creator: StateCreator<T>): () => T;
}

declare module 'zustand/middleware' {
  export function devtools<T>(options?: { name?: string }): (creator: any) => any;
}
