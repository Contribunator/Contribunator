// it maps through all keys and values of an object/array and returns a new object/array
// it passes the key and the value to the transform function
// it returns the original values if unmodified
export default function deepObjectMap(
  obj: unknown | unknown[],
  transform: (key: string | number, value: unknown) => unknown,
  parentKey: string | number = ""
): unknown | unknown[] {
  if (Array.isArray(obj)) {
    return obj.map((value, index) =>
      deepObjectMap(value, transform, `${parentKey}[${index}]`)
    );
  } else if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce(
      (newObj: Record<string, unknown>, [key, value]) => {
        newObj[key] = deepObjectMap(
          value,
          transform,
          parentKey ? `${parentKey}.${key}` : key
        );
        return newObj;
      },
      {}
    );
  } else {
    return transform(parentKey, obj);
  }
}
