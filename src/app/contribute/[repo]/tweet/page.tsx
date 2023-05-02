import { getRepoConfig } from "@/config";
// import { getRepoData } from "@/octokit";
import TweetForm from "./form";

type Props = {
  params: {
    repo: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

export default async function TweetPage({
  params: { repo },
  searchParams: options,
}: Props) {
  const config = await getRepoConfig(repo);
  // const data = await getRepoData(repo);

  // TODO might need to get some specific information about this type of update to pass to client form
  // initialize with empty state

  return (
    <div>
      <h2>Submit a new Tweet to {config.title}</h2>
      {/* {<pre>{JSON.stringify({ config, data, options }, null, 2)}</pre>} */}
      <TweetForm
        repo={repo}
        options={options}
        className="space-y-5 border border-red-600"
      />
    </div>
  );
}
