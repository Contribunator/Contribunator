import { HiVideoCamera } from "react-icons/hi";
import { C11RConfig } from "./types";

const config: C11RConfig = {
  owner: "Contribunator",
  repos: [
    {
      name: "Sample Repo",
      repo: "Sample",
      contributions: [
        {
          type: "video",
          icon: HiVideoCamera,
          name: "Video",
          options: { title: "This is a test" },
        },
        {
          type: "tweet",
          name: "Poll",
          description: "A poll tweet",
          options: { type: "poll" },
        },
      ],
    },
  ],
};

/*
const config: C11RConfig = {
  owner: "ethereumclassic",
  repos: [
    {
      name: "ETC Website",
      repo: "ethereumclassic.github.io",
      contributions: [
        {
          type: "video",
          icon: HiVideoCamera,
          name: "Video",
          options: { title: "This is a test" },
        },
        {
          type: "video",
          name: "Video with something else",
          options: { title: "Video, but with a different title" },
        },
      ],
    },
    {
      name: "@eth_classic Twitter",
      repo: "tweets-etc_network",
      contributions: [{ type: "tweet", name: "Simple Tweet" }],
    },
    {
      name: "@etc_network Twitter",
      repo: "tweets-eth_classic",
      contributions: [
        { type: "tweet", name: "Simple Tweet" },
        {
          type: "tweet",
          name: "Poll",
          description: "A poll tweet",
          options: { type: "poll" },
        },
      ],
    },
    {
      name: "Test Failed to get repo",
      repo: "not-real",
      contributions: [],
    },
  ],
};
*/
export default config;
