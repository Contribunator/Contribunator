// truncate data:image... to data:image...<6 chars>
export function deepTrimImageData(obj: any): any {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepTrimImageData);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string" && value.startsWith("data:image")) {
        const [prefix, data] = value.split(",");
        return [key, `${prefix},${data.slice(0, 6)}...`];
      }
      return [key, deepTrimImageData(value)];
    })
  );
}
