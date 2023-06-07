import genericConfig from "@/contributions/generic/config";
import {
  FaBook,
  FaDiscord,
  FaGithub,
  FaLink,
  FaMedium,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { HiDesktopComputer } from "react-icons/hi";

export default genericConfig({
  title: "App",
  description: "Submit a new application",
  icon: HiDesktopComputer,
  color: "slate",
  useFilesOnServer: {
    links: "apps.yaml",
  },
  options: {
    // TODO
    commit: async ({ files, timestamp, body: { name, url, category } }) => {
      throw new Error("Testing!");
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
        validation: { required: true, max: 1000 },
      },
      // TODO generate the date automatically
      // date: { title: "TODO DATE INPUT", type: "text", placeholder: "TODO" },
      icon: {
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
      // TODO misc links, e.g. discord, etc.
      // VERIFIACTION BADGES
      authorLink: {
        title: "Author Link",
        type: "text",
        placeholder: "eg. https://author-website.com/",
        info: "Optional link to the author's website, not the app itself",
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
      },
      openSource: {
        title: "Source Code Link",
        type: "text",
        placeholder: "e.g. https://github.com/my-org/my-repo",
        info: "Open Source Definition",
        infoLink: "https://en.wikipedia.org/wiki/The_Open_Source_Definition",
      },
      audit: {
        title: "Link to Audit",
        type: "text",
        placeholder: "e.g. https://example.com",
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
      otherLinks: {
        title: "Other Links",
        type: "collection",
        limit: 5,
        addButton: "Add another link",
        fields: {
          title: {
            title: "Link title",
            type: "text",
            validation: { required: true },
          },
          url: {
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
