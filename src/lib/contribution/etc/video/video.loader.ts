import type { ContributionLoaded } from "@/types";

import { demo, e2e } from "@/lib/env";
import { getDateStamp } from "@/lib/helpers/timestamp";
import { VideoOptions } from ".";

export default function videoLoader({
  options: { collectionPath },
}: VideoOptions): ContributionLoaded {
  if (!collectionPath) {
    throw new Error("Videos config requires a collectionPath");
  }

  return {
    useFilesOnServer: {
      videos: collectionPath,
    },
    useDataOnServer: async ({ data: { youtube } }) => {
      if (e2e || demo) {
        return {
          yt: {
            title: "E2E Test Video Title",
            description: "E2E Test Video Description",
            channelId: "CHANNEL_ID",
            channelTitle: "E2E Test Video Author",
            publishedAt: "2021-01-01T00:00:00Z",
          },
        };
      }
      if (!process.env.YOUTUBE_API_KEY) {
        throw new Error("YOUTUBE_API_KEY not set");
      }
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtube}&key=${process.env.YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return { yt: data.items[0].snippet };
    },
    prMetadata: (props) => {
      const {
        data: { youtube, title },
        fetched: { yt = {} } = {},
      } = props;
      const missingTitle = "[video title]";
      const missingAuthor = "[author]";
      const vAuthor = yt.channelTitle || missingAuthor;
      const vTitle = title || yt.title || missingTitle;
      return {
        title: `Add Video: ${vAuthor} - ${vTitle
          .split(" ")
          .slice(0, 6)
          .join(" ")}`,
        message: `This PR adds the video [${
          title || yt.title || missingTitle
        }](https://www.youtube.com/watch?v=${youtube}) by [${vAuthor}](https://www.youtube.com/channel/${
          yt.channelId || "CHANNEL_ID"
        }).`,
      };
    },
    commit: async ({
      files,
      data: { title, tags, description, youtube },
      fetched: { yt },
    }) => {
      const video = {
        title: title || yt.title,
        date: getDateStamp(),
        uploaded: getDateStamp(yt.publishedAt, "PUBLISHED"),
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
          transform: (value) => {
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
  };
}
