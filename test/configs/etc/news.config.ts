import genericConfig from "@/contributions/generic/config";
import { HiNewspaper } from "react-icons/hi";

export default genericConfig({
  title: "News Item",
  description: "A link to an article on an external website",
  icon: HiNewspaper,
  // useFilesOnServer: {
  //   links: "links.yaml",
  // },
  options: {
    commit: async ({ files, timestamp, body: { name, url, category } }) => {
      throw new Error("Just testing");
      // // if links file doesnt exist, create it
      // const links = files.links?.parsed || [];
      // // append the new link to the links array
      // links.push({ name, url, category, timestamp });
      // // return the new links array
      // return { yaml: { "links.yaml": links } };
    },
    fields: {
      name: {
        type: "text",
        title: "Article Name",
        placeholder: "e.g. Hard Fork Success!",
        validation: { required: true, min: 10, max: 50 },
      },
      link: {
        type: "text",
        title: "Article URL",
        placeholder: "e.g. https://www.example.com",
        validation: { required: true, url: true },
      },
      author: {
        type: "text",
        title: "Author Name",
        placeholder: "e.g. Johnny Dapp",
      },
      source: {
        type: "text",
        title: "Source Name",
        placeholder: "e.g. CoinDesk",
      },
      // date: {
      //   type: "text",
      //   title: "Date Published",
      //   placeholder: "e.g. Hard Fork Success!",
      //   validation: { required: true, min: 3, max: 50 },
      // },
      tags: {
        type: "choice",
        multiple: true,
        as: "buttons",
        validation: { required: true, max: 5 },
        title: "Tags",
        options: {
          announcement: { title: "Announcements" },
          development: { title: "Development" },
          education: { title: "Education" },
          event: { title: "Events" },
          exchange: { title: "Exchanges" },
          guide: { title: "Guides" },
          hardfork: { title: "Hard Forks" },
          media: { title: "Media" },
          mining: { title: "Mining" },
          podcast: { title: "Podcasts" },
          teams: { title: "Teams" },
          trading: { title: "Trading" },
          wallet: { title: "Wallets" },
          philosophy: { title: "Philosophy" },
          series: { title: "Series" },
        },
      },
    },
  },
});
