import { Route } from "next";
import Link from "next/link";
import { ConfigWithContribution } from "@/util/config";

import contributionPage from "@/components/contributionPage";
import TweetForm from "../tweetForm";

function TweetPage({
  children,
  config,
}: {
  config: ConfigWithContribution;
  children: React.ReactNode;
}) {
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
      {children}
    </>
  );
}

export default contributionPage(TweetPage, TweetForm, "tweet");
