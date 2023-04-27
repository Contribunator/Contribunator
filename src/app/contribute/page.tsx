import config from "@/config";
import Repo from "./repo";

const { repos, owner } = config;

const ContributePage = () => {
  return (
    <>
      {/* <div>Select a repository to contribute to</div> */}
      <div className="flex flex-col space-y-8">
        {repos.map((repo) => (
          <Repo key={repo.repo} owner={owner} repo={repo} />
        ))}
      </div>
    </>
  );
};

export default ContributePage;
