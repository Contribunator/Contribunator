import { HiVideoCamera } from "react-icons/hi";
import { IconType } from "react-icons";

export type C11RContribution = {
  name: string;
  type: string;
  description?: string;
  options?: { [key: string]: any };
  icon?: IconType;
};

export type C11RRepo = {
  title: string;
  name: string;
  contributions: C11RContribution[];
};

export type C11RConfig = {
  owner: string;
  repos: C11RRepo[];
};

const config: C11RConfig = {
  owner: "Contribunator",
  repos: [
    {
      title: "Sample Repo",
      name: "Sample",
      // TODO add optional `bases` field to allow choice of which branch to merge to
      contributions: [
        {
          type: "video",
          icon: HiVideoCamera,
          name: "Video",
          options: { title: "This is a test" },
        },
        {
          type: "tweet",
          name: "Tweet",
          description: "Submit a Tweet",
          // options: { type: "poll" },
        },
      ],
    },
  ],
};

export function getRepoConfig(repo: string) {
  const { repos, ...rest } = config;
  const repoConfig = repos.find((r) => r.name === repo);
  if (!repoConfig) {
    throw new Error(`Config not defined for repo: ${repo}`);
  }
  return { ...rest, ...repoConfig };
}

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
