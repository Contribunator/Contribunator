import genericConfig from "@/contributions/generic/config";
import { FaTwitter } from "react-icons/fa";

export default genericConfig({
  title: "Generic Tweet",
  description: "Recreate Tweet with Generic",
  icon: FaTwitter,
  color: "blue",
  options: {
    commit: async ({ files, timestamp, body: { name, url, category } }) => {
      // if links file doesnt exist, create it
      throw new Error("Just testing!");
      // const links = files.links?.parsed || [];
      // // append the new link to the links array
      // links.push({ name, url, category, timestamp });
      // // return the new links array
      // return { yaml: { "links.yaml": links } };
    },
    fields: {
      quoteType: {
        type: "choice",
        title: "Quote Type",
        as: "buttons",
        unset: "None",
        options: {
          retweet: {
            title: "Retweet",
          },
          reply: {
            title: "Reply",
          },
        },
      },
      name: {
        type: "text",
        as: "textarea",
        title: "Tweet Text",
        // placeholder: "e.g. The Best Website Ever",
        // validation: { required: true, min: 3, max: 50 },
      },
      media: {
        type: "images",
        title: "Upload Images",
      },
    },
  },
});
