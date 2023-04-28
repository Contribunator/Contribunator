import Link from "next/link";
import { HiExclamationCircle, HiStar } from "react-icons/hi";
import { getRepoData } from "@/octokit";
import ContributionLink from "./contributionLink";
import { getRepoConfig } from "@/config";
import { Route } from "next";

type Props = {
  name: string;
};

const Repo = async (props: Props) => {
  const { name } = props;
  // fetch repo information from github api
  const repo = await getRepoConfig(name);
  const data = await getRepoData(name);

  // return an error if we can't find the repo
  if (!data) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <HiExclamationCircle className="text-2xl" />
          <span>
            Failed to fetch{" "}
            <b>
              {repo.owner}/{repo.name}
            </b>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-start">
          <div className="flex-auto">
            <h2 className="card-title">{name}</h2>
            <Link
              className="text-sm"
              href={data.html_url as Route}
              target="_blank"
            >
              {data.full_name}
            </Link>
          </div>
          <div className="text-md flex items-center space-x-2">
            {/* TODO some other repo stats */}
            {/* <div>Updated {new Date(data.updated_at).toLocaleDateString()}</div> */}
            <div>{data.stargazers_count}</div>
            <div>
              <HiStar />
            </div>
          </div>
        </div>
        <div className="card grid grid-cols-3 bg-base-100">
          {repo.contributions.map((contribution) => (
            <ContributionLink
              key={contribution.name}
              repo={repo}
              contribution={contribution}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Repo;
