import genericConfig from "@/contributions/generic/config";
import { Contribution } from "@/lib/config";
import slugify from "@/lib/slugify";
import timestamp from "@/lib/timestamp";

import {
  FaBook,
  FaDiscord,
  FaGithub,
  FaLink,
  FaMedium,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

export type Options = Partial<
  Pick<Contribution, "title" | "description" | "icon" | "color"> & {
    options: {
      title?: string;
      description?: string;
      imagePath?: string;
      absoluteImagePath?: string;
      collectionPath?: string;
    };
  }
>;

// TODO make paths, etc, configurable
export default function appConfig(opts: Options = {}) {
  const { options = {} } = opts;

  // TODO throw if not set
  const appsPath = options.collectionPath || "test/data/apps.yaml";
  const relativeImagePath = options.imagePath || "apps/";
  const absoluteImagePath = options.absoluteImagePath || relativeImagePath;

  return genericConfig({
    title: "App",
    description: "Submit a new application",
    icon: HiCursorClick,
    color: "purple",
    ...opts,
    useFilesOnServer: {
      apps: appsPath,
    },
    prMetadata: ({ title, url, type, description }) => {
      return {
        title: `Add application: ${title}`,
        message: `This Pull Request adds a new ${type} app:
          
**${title}**
${url}

${description}`,
      };
    },

    options: {
      ...opts.options,
      commit: async ({ files, timestamp: t, fields }) => {
        const { image, url, title, description, links = [], ...rest } = fields;

        let newApp: any = {
          date: timestamp("YYYY-MM-DD"),
          title,
          description,
        };

        const images: { [key: string]: string } = {};
        if (image) {
          const imageName = `${t}-${slugify(title)}.${image.type}`;
          images[`${absoluteImagePath}/${imageName}`] = image.data;
          newApp.image = `${relativeImagePath}/${imageName}`;
        }

        newApp = {
          ...newApp,
          ...rest,
          links: [{ title: "Launch App", link: url }, ...links],
        };

        // TODO option to pass image resizing / aspect ratio.
        return {
          images,
          yaml: {
            [appsPath]: [newApp, ...(files.apps.parsed || [])],
          },
        };
      },
      fields: {
        type: {
          type: "choice",
          validation: { required: true },
          title: "App Category",
          options: {
            nfts: { title: "NFTs" },
            games: { title: "Games" },
            identity: { title: "Identity Systems" },
            interoperability: { title: "Interoperability" },
            finance: { title: "Finance" },
            other: { title: "Other" },
          },
        },
        title: {
          title: "App Name",
          type: "text",
          placeholder: "e.g. Super Swap",
          validation: { required: true, max: 42 },
        },
        url: {
          title: "URL to Launch App",
          type: "text",
          placeholder: "e.g. https://app.example.com",
          validation: { required: true, url: true },
        },
        description: {
          title: "App Description",
          type: "text",
          as: "textarea",
          placeholder: "e.g. An amazing app that does amazing things!",
          validation: { required: true, max: 500 },
        },
        image: {
          title: "App Icon",
          type: "image",
          aspectRatio: 1,
        },
        author: {
          title: "Author Name",
          type: "text",
          placeholder: "e.g. Satoshi Nakamoto",
          validation: { required: true, max: 42 },
        },
        authorLink: {
          title: "Author Link",
          type: "text",
          placeholder: "eg. https://author-website.com/",
          info: "Optional link to the author's website, not the app itself",
          validation: { url: true },
        },
        trustInfo: {
          type: "info",
          title:
            "The following fields are optional, but will help users trust your app",
        },
        verifiedContract: {
          title: "Verified Contract Link",
          type: "text",
          placeholder:
            "e.g. https://blockscout.com/etc/mainnet/address/0x0000000000000000000000000000000000000000/contracts",
          validation: { url: true },
        },
        openSource: {
          title: "Source Code Link",
          type: "text",
          placeholder: "e.g. https://github.com/my-org/my-repo",
          info: "Open Source Definition",
          infoLink: "https://en.wikipedia.org/wiki/The_Open_Source_Definition",
          validation: { url: true },
        },
        audit: {
          title: "Link to Audit",
          type: "text",
          placeholder: "e.g. https://example.com",
          validation: { url: true },
        },
        testSuite: {
          title: "Test Suite Link",
          type: "text",
          placeholder: "eg. https://github.com/my-org/my-repo/tree/main/tests",
          validation: { url: true },
        },
        ipfsFrontend: {
          title: "IPFS Frontned",
          type: "text",
          placeholder:
            "e.g. https://cloudflare-ipfs.com/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
          validation: { url: true },
        },
        linksInfo: {
          type: "info",
          title:
            "Below you can add any relevant links, such as docs, twitter, discord, etc.",
        },
        links: {
          title: "Other Links",
          type: "collection",
          limit: 5,
          addButton: "Add another link",
          fields: {
            name: {
              title: "Link Name",
              type: "text",
              validation: { required: true },
            },
            link: {
              title: "Link URL",
              type: "text",
              validation: { url: true, required: true },
            },
            icon: {
              title: "Link Icon",
              type: "choice",
              as: "buttons",
              unset: "No Icon",
              options: {
                link: { icon: FaLink },
                book: { icon: FaBook },
                github: { icon: FaGithub },
                twitter: { icon: FaTwitter },
                discord: { icon: FaDiscord },
                telegram: { icon: FaTelegram },
                medium: { icon: FaMedium },
              },
            },
          },
        },
        // TODO links collection
      },
    },
  });
}
