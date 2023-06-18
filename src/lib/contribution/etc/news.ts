import { HiNewspaper } from "react-icons/hi";

import timestamp from "@/lib/helpers/timestamp";

import { ContributionLoader, ContributionOptions, Form } from "@/types";

import contribution from "@/lib/contribution";

export type NewsConfig = Omit<ContributionOptions, "commit" | "form"> & {
  collectionPath: string;
  form?: Omit<Form, "fields">;
};

export default function news({
  collectionPath,
  ...opts
}: NewsConfig): ContributionLoader {
  if (!collectionPath) {
    throw new Error("News config requires a collectionPath");
  }

  return contribution({
    title: "News Item",
    description: "A link to an article on an external website",
    icon: HiNewspaper,
    color: "green",
    ...opts,
    useFilesOnServer: {
      news: collectionPath,
    },
    commit: async ({ files, fields }) => {
      return {
        yaml: {
          [files.news.path]: [
            { date: timestamp("YYYY-MM-DD"), ...fields },
            ...(files.news.parsed || []),
          ],
        },
      };
    },
    form: {
      ...opts.form,
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
}
