import Link from "next/link";

import { Repo, ContributionMeta } from "@/types";

const ContributionLink = ({
  name,
  contribution: { icon: Icon, title, description, color },
  repo,
}: {
  contribution: ContributionMeta;
  repo: Repo;
  name: string;
}) => {
  const url = `/contribute/${repo.name}/${name}`;

  return (
    <Link
      className={`flex overflow-hidden rounded-md bg-base-100 hover:bg-${color}-100 transition-colors`}
      href={{ pathname: url }}
    >
      <div className="flex-0">
        <div className={`bg-${color}-800 w-16 h-16 m-2 p-4 rounded-md`}>
          <Icon className="text-white w-full h-full" />
        </div>
      </div>
      <div className="p-2 flex items-center">
        <div>
          <div className="font-bold">{title}</div>
          {description && <div className="text-sm">{description}</div>}
        </div>
      </div>
    </Link>
  );
};
export default ContributionLink;
