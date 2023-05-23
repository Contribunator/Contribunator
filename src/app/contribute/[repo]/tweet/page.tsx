import { getConfig } from "@/util/config";
import Link from "next/link";
import { Route } from "next";
import TweetForm from "./tweetForm";
import useUser from "@/util/useUser";

type Props = {
  params: {
    repo: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

export default async function TweetPage({ params: { repo } }: Props) {
  const config = await getConfig(repo);
  const user = await useUser();
  return (
    <>
      <div>
        <h2 className="title">Submit a Tweet to {config.repo.title}</h2>
        <p className="text-sm">
          Please ensure your tweet follows the rules outlined in the{" "}
          <Link
            className="link"
            target="_blank"
            href={config.repo.githubUrl as Route}
          >
            Github Repo
          </Link>
        </p>
      </div>
      {/* TODO make it so I don't need to pass the user here */}
      <TweetForm repo={repo} user={user} className="cell space-y-6" />
    </>
  );
}
