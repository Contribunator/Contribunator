import get from "lodash/get";
import mapKeys from "lodash/mapKeys";
import set from "lodash/set";
import sortBy from "lodash/sortBy";

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

import type { ContributionLoaded, VisibleProps } from "@/types";
import { CatMap, LinkOptions } from ".";

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

// TODO make this more configurable, default name, cat-specific keymap

export default function linkLoader({
  options: { categories, keyMap = {} },
}: LinkOptions): ContributionLoaded {
  if (!categories) {
    throw new Error("Link config requires categories");
  }

  return {
    useFilesOnServer({ data: { category } }) {
      const links = getCatProp("sourcePath", category, categories);
      if (!links) throw new Error("No sourcePath found for category", category);
      return { links };
    },
    commit: async ({ files: { links }, data: { category, ...data } }) => {
      const sourceKey = getCatProp("sourceKey", category, categories);
      // TODO itemsKey into an option?
      const itemsKey = `items.${sourceKey}.items`;
      // upsert the existing object, sort by name
      const oldLinks = get(links.parsed || {}, itemsKey, {});
      const newLinks: any = {};

      oldLinks[data.name] = mapKeys(data, (_v, key) => keyMap[key] || key);

      sortBy(Object.keys(oldLinks), (key) => key.toLowerCase()).forEach(
        (key) => {
          newLinks[key] = oldLinks[key];
        }
      );

      return {
        yaml: {
          [links.path]: set(links.parsed || {}, itemsKey, newLinks),
        },
      };
    },
    form: {
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
  };
}
