import Link from "next/link";
import ContributionLink from "./contributionLink";
import { getRepoConfig } from "@/config";
import { Route } from "next";

const RepositoryDetails = async ({ name }: { name: string }) => {
  // fetch repo information from github api
  const repo = await getRepoConfig(name);

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
        {repo.contributions.map((contribution) => (
          <ContributionLink
            key={contribution.name}
            repo={repo}
            contribution={contribution}
          />
        ))}
      </div>
    </div>
  );
};
export default RepositoryDetails;
