export function alwaysTrue() {
  return true;
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`Assert: ${message || 'false'}`);
  }
}

export function randomInt() {
  return Math.floor(Math.random() * (2 ** 31 - 1));
}
