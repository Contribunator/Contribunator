import set from "lodash/set";
import get from "lodash/get";

import type {
  ConfigWithContribution,
  Contribution,
  ExtractedImages,
  ExtractedImagesDeep,
  ExtractedImagesFlat,
} from "@/types";

import slugify from "@/lib/helpers/slugify";

type ExtractImagesProps = {
  timestamp: string;
  fields: any; // todo rename
  config: ConfigWithContribution;
};

function getImageName(
  obj: any,
  path: Path,
  contribution: Contribution,
  timestamp: string
): string {
  // check if we're iterating over an array
  const iterator = typeof path[path.length - 1] === "number";
  // create a query path to get from form definition
  const query = path
    .map((p) => (typeof p === "number" ? "fields" : p))
    .slice(0, iterator ? -1 : undefined);
  // traverse the path and get parent field titles
  const parentName = path
    .map((p, i) => {
      if (typeof p === "number") {
        return p;
      } else {
        const parent = get(contribution.form.fields, query.slice(0, i + 1));
        return parent.title || p;
      }
    })
    .join(" ");
  // create a file-safe filename
  const fileName = slugify(
    `${timestamp} ${contribution.title} ${parentName} ${obj.alt || ""}`,
    {
      slice: Infinity,
    }
  );
  return `${fileName}.${obj.type}`;
}

type Path = (string | number)[];

export default function extractImages({
  timestamp,
  fields,
  config,
}: ExtractImagesProps): ExtractedImages {
  // we can query the contribution to get the field name
  const { contribution } = config;
  const flat: ExtractedImagesFlat = {};
  const deep: ExtractedImagesDeep = {};
  const getImagesDeep = (obj: any, path: Path = []) => {
    if (typeof obj === "object") {
      // iterate over arrays
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => getImagesDeep(item, [...path, i]));
        return;
      }
      // match images
      if (
        obj?.type &&
        ["png", "jpg", "jpeg"].includes(obj.type) &&
        obj?.data.startsWith("data:image/")
      ) {
        const name = getImageName(obj, path, contribution, timestamp);
        flat[name] = obj.data;
        set(deep, path, obj.data);
        return;
      }
      // otherwise let's go deeper!
      Object.keys(obj).forEach((key) =>
        getImagesDeep(obj[key], [...path, key])
      );
    }
  };
  getImagesDeep(fields);
  return { deep, flat };
}
