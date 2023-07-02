import Link from "next/link";
import { HiHome } from "react-icons/hi";

import getConfig from "@/lib/config";

import RepositoryDetails from "./repositoryDetails";

export default async function ContributionsPage() {
  const config = await getConfig();
  return (
    <>
      <h2 className="title">Select a Contribution Type</h2>
      <div className="flex flex-col space-y-8 my-8">
        {Object.values(config.repos).map((repo) => (
          <RepositoryDetails key={repo.name} repo={repo} />
        ))}
      </div>
      <Link href="/" className="btn">
        <HiHome />
        Home
      </Link>
    </>
  );
}
