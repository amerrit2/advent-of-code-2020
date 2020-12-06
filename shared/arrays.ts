export function count<T>(arr: T[], predicate: (t: T) => boolean) {
  return arr.reduce((count, t) => (predicate(t) ? count + 1 : count), 0);
}
