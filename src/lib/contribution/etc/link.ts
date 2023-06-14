import _ from "lodash";
import { HiLink } from "react-icons/hi";
import {
  FaDiscord,
  FaFacebook,
  FaNewspaper,
  FaReddit,
  FaTelegramPlane,
  FaTwitter,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";

import type {
  Contribution,
  ContributionOptions,
  Form,
  VisibleProps,
} from "@/types";

import contribution from "@/lib/contribution";

type CatItem = {
  title: string;
  sourcePath?: string;
  showIcons?: boolean;
  showDescription?: boolean;
  sourceKey?: string;
  [key: string]: CatItem | string | boolean | undefined;
};

export type CatMap = {
  [key: string]: CatItem;
};

// recursively transform categories into formOptions
function getFormOptions(obj: any): any {
  return Object.keys(obj).reduce((acc: any, key: string) => {
    if (typeof obj[key] !== "object") return acc;
    const options = getFormOptions(obj[key]);
    return {
      ...acc,
      [key]: {
        title: obj[key].title,
        options: Object.keys(options).length ? options : undefined,
      },
    };
  }, {});
}

// traverse categories and find the first parent with a matching key
function getCatProp(keyToMatch: string, cat: string, categories: CatMap) {
  let prop: any = categories;
  cat.split(".").forEach((key: string) => {
    if (typeof prop !== "object") return;
    prop = prop[key][keyToMatch] || prop[key];
  }, categories);
  return typeof prop !== "object" && prop;
}

export type LinkConfig = Omit<ContributionOptions, "form" | "commit"> & {
  categories: CatMap;
  form?: Omit<Form, "fields">;
};

export default function link({
  categories,
  ...opts
}: LinkConfig): Contribution {
  if (!categories) {
    throw new Error("Link config requires categories");
  }

  return contribution({
    title: "Link",
    description: "Add links to a website",
    icon: HiLink,
    color: "yellow",
    ...opts,
    useFilesOnServer({ category }: any) {
      const links = getCatProp("sourcePath", category, categories);
      console.log("got links", links);
      if (!links) throw new Error("No sourcePath found for category", category);
      return { links };
    },
    commit: async ({ files: { links }, fields: { category, ...fields } }) => {
      const sourceKey = getCatProp("sourceKey", category, categories);
      // TODO itemsKey into an option?
      const itemsKey = `items.${sourceKey}.items`;
      // upsert the existing object, sort by name
      return {
        yaml: {
          [links.path]: _.set(
            links.parsed,
            itemsKey,
            _.sortBy(
              [
                _.mapKeys(fields, (_v, key) => `__${key}`),
                ..._.get(links.parsed, itemsKey, []),
              ],
              "__name"
            )
          ),
        },
      };
    },
    form: {
      ...opts.form,
      fields: {
        category: {
          type: "choice",
          validation: { required: true },
          title: "Category",
          options: getFormOptions(categories),
        },
        name: {
          type: "text",
          title: "Name", // TODO option to make this dynamic
          placeholder: "e.g. My Website Name",
          validation: { required: true, min: 3, max: 50 },
        },
        link: {
          type: "text",
          title: "URL",
          placeholder: "e.g. https://www.example.com",
          validation: { required: true, url: true },
        },
        icon: {
          title: "Icon",
          type: "choice",
          unset: "No Icon",
          as: "buttons",
          visible: ({ formik }: VisibleProps) => {
            const cat = formik.getFieldProps("category").value;
            return cat && getCatProp("showIcons", cat, categories);
          },
          options: {
            facebook: { icon: FaFacebook },
            twitter: { icon: FaTwitter },
            telegram: { icon: FaTelegramPlane },
            discord: { icon: FaDiscord },
            youtube: { icon: FaYoutube },
            video: { icon: FaVideo },
            reddit: { icon: FaReddit },
            newspaper: { icon: FaNewspaper },
          },
        },
        description: {
          title: "Description",
          type: "text",
          as: "textarea",
          placeholder: "e.g. This website contains lots of useful information.",
          visible: ({ formik }: VisibleProps) => {
            const cat = formik.getFieldProps("category").value;
            return cat && getCatProp("showDescription", cat, categories);
          },
        },
      },
    },
  });
}
