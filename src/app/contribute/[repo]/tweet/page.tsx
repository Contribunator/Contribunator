import { default as config, getRepoConfig } from "@/config";
import Link from "next/link";
import { Route } from "next";
import TweetForm from "./tweetForm";
import useUser from "@/components/useUser";

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
  const user = await useUser();
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
      {/* TODO make it so I don't ened to pass user here, with composition? */}
      <TweetForm user={user} className="cell space-y-6" />
      {/* {<pre>{JSON.stringify({ config, data, options }, null, 2)}</pre>} */}
    </>
  );
}
