export function cloneObject (object) {
  if (object === undefined) return undefined;
  else if (object === null) return null;
  return JSON.parse(JSON.stringify(Object.assign({}, object)));
};

export function cloneArray (array) {
  return JSON.parse(JSON.stringify(array));
};