// This file contains convenience functions I wrote myself for other projects.

/**
 * Generates a range of numbers in [`start`,`end`), changing number by `delta` each iteration.
 * @param start The starting point of the range. Inclusive: the first item output will be equal to this.
 * @param end The ending point of the range. Exclusive: the last item will stop short of equaling this.
 * @param delta The amount to increment by on each iteration. Can be used to skip integers, generate non-integers, or count backward.
 * @example
 * [...range(0, 5)]
 * // [0, 1, 2, 3, 4]
 * [...range(12, 25)]
 * // [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
 * [...range(30, 60, 3)]
 * // [30, 33, 36, 39, 42, 45, 48, 51, 54, 57]
 * [...range(10, 0, -1)]
 * // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
 * [...range(0, 0.5, 0.1)]
 * // [0.0, 0.1, 0.2, 0.3, 0.4]
 * // floating-point addition isn't perfectly precise, so these values won't exactly reproduce
 */
export function* range(start: number, end?: number, delta: number = 1) {
  const rangeStart = end === undefined ? 0 : start;
  const rangeEnd = end === undefined ? start : end;
  if (delta < 0) {
    for (let a = rangeStart; a > rangeEnd; a += delta) {
      yield a;
    }
  } else {
    for (let a = rangeStart; a < rangeEnd; a += delta) {
      yield a;
    }
  }
}
