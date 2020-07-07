export function required(value) {
  return typeof value !== 'undefined' && value !== null;
}
