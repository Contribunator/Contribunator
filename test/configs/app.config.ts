import genericConfig from "@/contributions/generic/config";
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
        info: "A link to the author's website, not the app itself",
      },
      linksInfo: {
        type: "info",
        text: "TODO: Other links, e.g. discord, etc.",
      },
      trustInfo: {
        type: "info",
        text: "The following fields are optional, but will help users trust your app",
      },
      verifiedContract: {
        title: "Verified Contract Link",
        type: "text",
        placeholder:
          "e.g. https://blockscout.com/etc/mainnet/address/0x0000000000000000000000000000000000000000/contracts",
      },
      openSource: {
        title: "Open Source Repo Link",
        type: "text",
        placeholder: "e.g. https://github.com/my-org/my-repo",
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
      // TODO links collection
    },
  },
});
