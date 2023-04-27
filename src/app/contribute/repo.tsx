import Link from "next/link";
import { HiExclamationCircle, HiStar } from "react-icons/hi";
import { octokit } from "@/octokit";
import Contribution from "./contribution";
import { C11RRepo } from "@/types";

type Props = {
  repo: C11RRepo;
  owner: string;
};

async function getData(opts: { owner: string; repo: string }) {
  // TODO caching etc, and make this generalized for easy querying.
  try {
    const { data } = await octokit.repos.get(opts);
    return data;
  } catch (e) {
    return null;
  }
}

const Repo = async (props: Props) => {
  const {
    owner,
    repo: { contributions, ...repo },
  } = props;
  // fetch repo information from github api
  const data = await getData({ owner, repo: repo.repo });

  // return an error if we can't find the repo
  if (!data) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <HiExclamationCircle className="text-2xl" />
          <span>
            Failed to fetch{" "}
            <b>
              {owner}/{repo.repo}
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
            <h2 className="card-title">{repo.name}</h2>
            <Link className="text-sm" href={data.html_url} target="_blank">
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
          {contributions.map((contribution) => (
            <Contribution
              key={contribution.name}
              {...{ owner, repo, contribution }}
            />
          ))}
        </div>
        {/* {<pre>{JSON.stringify({ repo, data }, null, 2)}</pre>} */}
      </div>
    </div>
  );
};
export default Repo;
