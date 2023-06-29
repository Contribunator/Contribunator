export * from "./config";
export * from "./contribution";
export * from "./pullRequest";
export * from "./form";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
