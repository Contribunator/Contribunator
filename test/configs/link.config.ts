import * as Yup from "yup";

import genericConfig from "@/contributions/generic/config";
import { HiLink } from "react-icons/hi";

export default genericConfig({
  title: "Link",
  description: "A link to a website",
  icon: HiLink,
  useFilesOnServer: {
    links: "links.yaml",
  },
  options: {
    commit: async ({ files, timestamp, body: { name, url, category } }) => {
      // if links file doesnt exist, create it
      const links = files.links?.parsed || [];
      // append the new link to the links array
      links.push({ name, url, category, timestamp });
      // return the new links array
      return { yaml: { "links.yaml": links } };
    },
    fields: {
      category: {
        type: "choice",
        validation: { required: true },
        title: "Category",
        options: {
          books: {
            title: "Books",
            options: {
              fiction: {
                title: "Fiction",
              },
              nonfiction: {
                title: "Non-Fiction",
                options: {
                  "self-help": {
                    title: "Self-Help",
                  },
                  "how-to": {
                    title: "How-To",
                  },
                  diy: {
                    title: "DIY",
                  },
                },
              },
            },
          },
          movies: {
            title: "Movies",
          },
          music: {
            title: "Music",
          },
        },
      },
      name: {
        type: "text",
        title: "Name",
        placeholder: "e.g. The Best Website Ever",
        validation: { required: true, min: 3, max: 50 },
      },
      url: {
        type: "text",
        title: "URL",
        placeholder: "e.g. https://www.example.com",
        validation: { required: true, url: true, max: 100 },
      },
    },
  },
});
