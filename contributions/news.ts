import { getDateStamp } from "@/lib/helpers/timestamp";

import type { ContributionLoaded } from "@/types";

export default function newsLoader(): ContributionLoaded {
  return {
    useFilesOnServer: {
      news: "content/news/links.collection.en.yaml",
    },
    commit: async ({ files, data: { date, ...data } }) => {
      return {
        yaml: {
          [files.news.path]: [
            { date: getDateStamp(date, !!date), ...data },
            ...(files.news.parsed || []),
          ],
        },
      };
    },
    form: {
      fields: {
        title: {
          type: "text",
          title: "Article Title",
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
        date: {
          type: "text",
          input: "date",
          clear: true,
          title: "Published Date",
          info: "Leave blank for today's date",
          placeholder: "e.g. 2021-01-01",
        },
      },
    },
  };
}
