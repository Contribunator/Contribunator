import config from "@/config";
import RepositoryDetails from "@/components/contribute/repositoryDetails";
import Link from "next/link";
import { HiHome } from "react-icons/hi";

const ContributePage = () => {
  return (
    <>
      <h2 className="title">Select a Contribution Type</h2>
      <div className="flex flex-col space-y-8 my-8">
        {Object.values(config.repos).map((repo) => (
          <RepositoryDetails key={repo.name} repo={repo} />
        ))}
      </div>
      <Link href="/" className="btn gap-2">
        <HiHome />
        Home
      </Link>
    </>
  );
};

export default ContributePage;
