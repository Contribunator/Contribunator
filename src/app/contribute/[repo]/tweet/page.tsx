import { default as config, getRepoConfig } from "@/config";
// import { getRepoData } from "@/octokit";
import Link from "next/link";
import { Route } from "next";
import TweetForm from "./tweetForm";

type Props = {
  params: {
    repo: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

export default async function TweetPage({ params: { repo } }: Props) {
  const repoConfig = await getRepoConfig(repo);
  // const url = `https://github.com/${config.owner}/${repoConfig.name}`;
  return (
    <>
      <div>
        <h2 className="title">Submit a Tweet to {repoConfig.title}</h2>
        <p className="text-sm">
          Please ensure your tweet follows the rules outlined in the{" "}
          <Link
            className="link"
            target="_blank"
            href={repoConfig.githubUrl as Route}
          >
            Github Repo
          </Link>
        </p>
      </div>
      <TweetForm className="cell space-y-6" />
      {/* {<pre>{JSON.stringify({ config, data, options }, null, 2)}</pre>} */}
    </>
  );
}
