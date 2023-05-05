import config from "@/config";
import RepositoryDetails from "@/components/contribute/repositoryDetails";
import Link from "next/link";

const ContributePage = () => {
  return (
    <>
      <h2 className="title">Select a Contribution Type</h2>
      <div className="flex flex-col space-y-8 my-8">
        {config.repos.map(({ name }) => {
          // @ts-expect-error Async Server Component
          return <RepositoryDetails key={name} name={name} />;
        })}
      </div>
      <Link href="/" className="btn">
        Back to Home
      </Link>
    </>
  );
};

export default ContributePage;
