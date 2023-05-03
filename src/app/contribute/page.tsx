import config from "@/config";
import RepositoryDetails from "@/components/contribute/repositoryDetails";

const ContributePage = () => {
  return (
    <>
      <div>Select a repository to contribute to</div>
      <div className="flex flex-col space-y-8">
        {config.repos.map(({ name }) => {
          // @ts-expect-error Async Server Component
          return <RepositoryDetails key={name} name={name} />;
        })}
      </div>
    </>
  );
};

export default ContributePage;
