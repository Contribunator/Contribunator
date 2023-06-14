import Link from "next/link";
import { Route } from "next";

import ContributionLink from "./contributionLink";
import { RepoWithContributions } from "@/types";

export default function RepositoryDetails({
  repo,
}: {
  repo: RepoWithContributions;
}) {
  return (
    <div className="cell">
      <h3 className="title -mb-1.5">{repo.title}</h3>
      <Link
        className="text-xs link-hover"
        href={repo.githubUrl as Route}
        target="_blank"
      >
        {repo.githubUrl}
      </Link>
      {repo.description && <p className="text-sm mt-2">{repo.description}</p>}
      <div className="space-y-2 mt-4">
        {Object.entries(repo.contributions).map(([name, contribution]) => (
          <ContributionLink
            key={name}
            repo={repo}
            name={name}
            contribution={contribution}
          />
        ))}
      </div>
    </div>
  );
}
