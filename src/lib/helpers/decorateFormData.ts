import {
  ConfigWithContribution,
  Data,
  ExtractedImagesFlat,
  FormData,
  FormDataItem,
} from "@/types";

import set from "lodash/set";
import get from "lodash/get";
import slugify from "./slugify";
import getTimestamp from "./timestamp";
import { COMMIT_REPLACE_SHA } from "../constants";

type Path = (string | number)[];

type DecorateFormDataProps = {
  timestamp?: string;
  data: Data;
  config: ConfigWithContribution;
};

export function decorateFormData({
  config: { contribution, repo },
  data,
  timestamp = getTimestamp(),
}: DecorateFormDataProps) {
  // todo also ensure the data is ordered
  // in the future we can apply transformations to the data here

  const images: ExtractedImagesFlat = {};
  const formData: FormData = {};
  const niceData: Data = {};

  const decorateDeep = (val: any, path: Path = []) => {
    // make sure populate formData to match the order of the form field
    const orderedIterate = (field = contribution.form.fields) => {
      const sorted: string[] = [];
      Object.keys(field).forEach((key) => {
        if (val[key]) sorted.push(key);
      });
      sorted.forEach((key) => decorateDeep(val[key], [...path, key]));
    };
    // skip matching if we're at the object root
    if (path.length === 0) {
      orderedIterate();
      return;
    }
    // iterate sequentially over object arrays
    if (Array.isArray(val) && typeof val[0] === "object") {
      Object.values(val).forEach((item, i) => decorateDeep(item, [...path, i]));
      return;
    }

    // match fields
    const iterator = typeof path[path.length - 1] === "number";
    // create a query path to get from form definition
    const query = path
      .map((p) => (typeof p === "number" ? "fields" : p))
      .slice(0, iterator ? -1 : undefined);

    // traverse the path and get parent field titles
    const field = get(contribution.form.fields, query);

    // go deeper if we're a collection
    if (field.type === "collection") {
      orderedIterate(field.fields);
      return;
    }

    // get the title recursively
    const fullTitle = path
      .map((p, i) => {
        if (typeof p === "number") {
          return `[${p + 1}]`;
        } else {
          const parent = get(contribution.form.fields, query.slice(0, i + 1));
          return parent?.title || p;
        }
      })
      .filter((p) => p) // remove empty items
      .join(" ");

    const item: FormDataItem = { field, fullTitle };

    if (["image", "images"].includes(field.type)) {
      const { data: imageData, ...rest } = val;
      const title = contribution.imageName
        ? contribution.imageName({ data })
        : `${contribution.title} ${fullTitle} ${val.alt || ""}`;
      item.fileName = `${timestamp}-${slugify(title, false)}.${val.type}`;
      item.filePath = `${contribution.imagePath}${item.fileName}`;
      const githubPrefix = `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${COMMIT_REPLACE_SHA}/`;
      item.markdown = `![${val.alt || ""}](${githubPrefix}${item.filePath})${
        val.alt ? `\n*${val.alt}*` : ""
      }`;
      images[item.filePath] = imageData;
      item.data = rest;
    } else {
      // copy the data of all other fields
      item.data = val;
    }

    if (field.type === "choice") {
      item.markdown = (Array.isArray(val) ? val : [val])
        .map((item: string) => {
          const path = item
            .split(".")
            .map((key) => ["options", key])
            .flat();
          return get(field, path)?.title || val;
        })
        .join(", ");
    }

    set(formData, path, item);
    set(niceData, path, val);
  };

  decorateDeep(data);

  return { images, formData, data: niceData };
}
