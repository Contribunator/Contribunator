import { HiVideoCamera } from "react-icons/hi";

import timestamp from "@/lib/helpers/timestamp";

import { ContributionLoader, ContributionOptions, Form } from "@/types";

import contribution from "@/lib/contribution";
import fetchYoutubeVideo from "@/lib/server/fetchYoutubeVideo";

export type NewsConfig = Omit<ContributionOptions, "commit" | "form"> & {
  collectionPath: string;
  form?: Omit<Form, "fields">;
};

export default function video({
  collectionPath,
  ...opts
}: NewsConfig): ContributionLoader {
  if (!collectionPath) {
    throw new Error("Videos config requires a collectionPath");
  }

  return contribution({
    title: "Video",
    description: "A YouTube video link",
    icon: HiVideoCamera,
    color: "red",
    ...opts,
    useFilesOnServer: {
      videos: collectionPath,
    },
    prMetadata: ({ youtube }) => ({
      title: `Add Video: ${youtube}`,
      message: `This PR adds the video https://www.youtube.com/watch?v=${youtube}`,
    }),
    commit: async ({
      files,
      fields: { title, tags, description, youtube },
    }) => {
      const yt = await fetchYoutubeVideo(youtube);
      const video = {
        title: title || yt.title,
        date: timestamp("YYYY-MM-DD"),
        uploaded: timestamp("YYYY-MM-DD", yt.publishedAt, "PUBLISHED"),
        youtube,
        authorYoutube: `channel/${yt.channelId}`,
        author: yt.channelTitle,
        tags,
        description,
      };
      return {
        yaml: {
          [files.videos.path]: [video, ...(files.videos.parsed || [])],
        },
      };
    },
    form: {
      ...opts.form,
      fields: {
        youtube: {
          type: "text",
          title: "Youtube Video ID",
          placeholder: "e.g. https://www.youtube.com/watch?v=GCBv1VCN2tE",
          validation: {
            required: true,
            matches: {
              regex: /^[a-zA-Z0-9_-]{11}$/,
              message: "Invalid YouTube Video ID",
            },
          },
          transform: (value: string) => {
            const regex =
              /(?:youtube.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
            const match = value.match(regex);
            if (match) {
              return match[1];
            } else if (value.length === 11) {
              return value;
            } else {
              return "";
            }
          },
          iframe: ({ field, meta }) => {
            if (!field.value || meta.error) return null;
            return `https://www.youtube.com/embed/${field.value}`;
          },
        },
        pasteInfo: {
          type: "info",
          title: "You can paste the YouTube Video ID or the full URL",
          visible: ({ formik }) => !formik.values.youtube,
        },
        tags: {
          type: "choice",
          multiple: true,
          as: "buttons",
          title: "Tags",
          options: {
            explainers: { title: "Explainers" },
            tutorials: { title: "Tutorials" },
            development: { title: "Development" },
            trading: { title: "Trading" },
            discussions: { title: "Discussions" },
            mining: { title: "Mining" },
            conferences: { title: "Conferences & Events" },
          },
        },
        title: {
          type: "text",
          title: "Override Title",
          info: "If left blank it will be fetched from YouTube",
        },
        description: {
          type: "text",
          title: "Optional Description",
          as: "textarea",
          info: "Do not include promotions or links to other sites",
          validation: { max: 1000, min: 20 },
        },
      },
    },
  });
}
