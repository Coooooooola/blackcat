export enum Paths {
  Index = '/',
  Login = '/login',
  Timeline = '/timeline',
}

export function alwaysTrue() {
  return true;
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`Assert: ${message || 'false'}`);
  }
}

export function emptyFunction() {}
