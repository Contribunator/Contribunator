import genericConfig from "@/contributions/generic/config";
import { FormikContextType } from "formik";
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
import { HiLink } from "react-icons/hi";

type CatItem = {
  title: string;
  sourcePath?: string;
  showIcons?: boolean;
  showDescription?: boolean;
  showWebsite?: boolean;
  sourceKey?: string;
  [key: string]: CatItem | string | boolean | undefined;
};

type CatMap = {
  [key: string]: CatItem;
};

const categoriesMap: CatMap = {
  wallets: {
    title: "Wallet",
    sourcePath: "content/services/wallets/index.yaml",
    web: {
      title: "Web Wallet",
      sourceKey: "web",
    },
    browser: {
      title: "Browser Integrated Wallet",
      sourceKey: "browsers",
    },
    hardware: {
      title: "Hardware Wallet",
      sourceKey: "hardware",
    },
    software: {
      title: "Software Wallet",
      sourceKey: "software",
    },
    other: {
      title: "Other Wallet Product",
      sourceKey: "other",
    },
  },
  exchanges: {
    title: "Exchange",
    sourcePath: "content/services/exchanges/index.yaml",
    trustMinimized: {
      title: "Trust-Minimizing Exchange (DEX)",
      sourceKey: "Trust-Minimizing Exchanges",
    },
    centralizedSpot: {
      title: "Centralized Spot Market (CEX)",
      sourceKey: "Centralized Spot Markets",
    },
    derivative: {
      title: "Centralized Derivative Market",
      sourceKey: "Centralized Derivative Markets",
    },
    crossChain: {
      title: "Cross-Chain Swap Exchange",
      sourceKey: "Cross-Chain Swap Exchanges",
    },
    nfts: {
      title: "NFT Marketplace",
      sourceKey: "NFT Marketplaces",
    },
    other: {
      title: "Other Exchange Service",
      sourceKey: "Other",
    },
  },
  social: {
    showIcons: true,
    title: "Social Channels",
    sourcePath: "content/community/channels/index.yaml",
    chatRooms: {
      title: "General Chat Room",
      sourceKey: "Chat Rooms",
    },
    developmentChat: {
      title: "Development Chat Room",
      sourceKey: "Development Chat",
    },
    telegramGroups: {
      title: "Telegram Group",
      sourceKey: "Telegram Groups",
    },
    forums: {
      title: "Forum",
      sourceKey: "Forums",
    },
    youtubeChannels: {
      title: "YouTube Channel or Playlist",
      sourceKey: "Media",
    },
    twitter: {
      title: "Twitter Account",
      sourceKey: "Twitter Accounts",
    },
    regional: {
      title: "Regional Community Websites",
      sourceKey: "Regional Website",
    },
  },
  dev: {
    title: "Mining & Development",
    priceSource: {
      title: "Price Source",
      sourcePath: "",
      sourceKey: "",
    },
    payment: {
      title: "Payment Processor",
      sourcePath: "",
      sourceKey: "",
    },
    dex: {
      title: "Development Experience",
      sourcePath: "",
      sourceKey: "",
    },
    endpoint: {
      showWebsite: true,
      title: "RPC Endpoint",
      sourcePath: "",
      sourceKey: "",
    },
    pools: {
      title: "Mining Pool",
      sourcePath: "",
      sourceKey: "",
    },
    explorers: {
      title: "Blockchain Explorer",
      sourcePath: "",
      sourceKey: "",
    },
    monitors: {
      title: "Network Monitor",
      sourcePath: "",
      sourceKey: "",
    },
    repo: {
      showDescription: true,
      title: "Git Repository",
      sourcePath: "",
      sourceKey: "",
    },
  },
  // TODO others with descriptions
};

// only pass relevent fields to form options
function getFormOptions(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const value = obj[key];
    if (typeof value === "object") {
      const options = getFormOptions(value);
      acc[key] = {
        title: value.title,
        ...(Object.keys(options).length > 0 && { options }),
      };
    }
    return acc;
  }, {});
}

const formOptions = getFormOptions(categoriesMap);

function getProperty(
  formikOrCat: string | FormikContextType<any>,
  match: string
) {
  const cat =
    typeof formikOrCat === "string"
      ? formikOrCat
      : formikOrCat.getFieldProps("category").value;
  if (!cat) return false;
  const res = cat.split(".").reduce((acc: CatMap, key: string) => {
    if (typeof acc !== "object") return acc;
    if (acc[key][match]) {
      return acc[key][match];
    }
    return acc[key];
  }, categoriesMap);
  return typeof res !== "object" && res;
}

export default genericConfig({
  title: "Links",
  description: "Add links to a website",
  icon: HiLink,
  color: "yellow",
  // this needs to be dynamic based on the request
  useFilesOnServer(values: any) {
    const path = getProperty(values.category, "sourcePath");
    // console.log("useFilesOnServer", path);
    return {
      links: getProperty(values.category, "sourcePath"),
    };
  },
  options: {
    commit: async ({ files, fields: { category, ...fields } }) => {
      const key = getProperty(category, "sourceKey");
      // console.log({ files, key, fields });
      const link: any = {};
      Object.entries(fields).forEach(([key, value]) => {
        link[`__${key}`] = value;
      });
      console.log({ link, files, key });
      throw new Error("Testing!");
      // if links file doesnt exist, create it
      // const links = files.links?.parsed || [];
      // // append the new link to the links array
      // links.push({ name, url, category, timestamp });
      // // return the new links array
      // return { yaml: { "links.yaml": links } };
    },
    fields: {
      category: {
        type: "choice",
        validation: { required: true },
        title: "Category",
        options: formOptions,
      },
      name: {
        type: "text",
        title: "Name", // TODO option to make this dynamic
        placeholder: "e.g. The Best Website Ever",
        validation: { required: true, min: 3, max: 50 },
      },
      url: {
        type: "text",
        title: "URL",
        placeholder: "e.g. https://www.example.com",
        validation: { required: true, url: true },
      },
      website: {
        type: "text",
        title: "Website URL",
        placeholder: "e.g. https://www.example.com",
        validation: { url: true },
        visible: ({ formik }) => {
          return getProperty(formik, "showWebsite");
        },
      },
      icon: {
        title: "Icon",
        type: "choice",
        unset: "No Icon",
        as: "buttons",
        // TODO this should be used in schema to validate
        visible: ({ formik }) => {
          return getProperty(formik, "showIcons");
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
        placeholder: "e.g. The best website ever",
        visible: ({ formik }) => {
          return getProperty(formik, "showDescription");
        },
      },
    },
  },
});
