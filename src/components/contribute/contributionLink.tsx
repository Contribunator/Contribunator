import { HiCode } from "react-icons/hi";
import Link from "next/link";
import { C11RRepo, C11RContribution } from "@/config";

type Props = {
  contribution: C11RContribution;
  repo: C11RRepo;
};

const ContributionLink = ({
  contribution: { icon, type, options, name, description, color = "slate" },
  repo,
}: Props) => {
  const Icon = icon || HiCode;
  return (
    <Link
      className={`flex overflow-hidden rounded-md bg-base-100 hover:bg-${color}-100 transition-colors`}
      href={{
        pathname: `/contribute/${repo.name}/${type}`,
        query: options,
      }}
    >
      <div className="flex-0">
        <div className={`bg-${color}-800 w-16 h-16 m-2 p-4 rounded-md`}>
          <Icon className="text-white w-full h-full" />
        </div>
      </div>
      <div className="p-2 flex items-center">
        <div>
          <div className="font-bold">{name}</div>
          {description && <div className="text-sm">{description}</div>}
        </div>
      </div>
    </Link>
  );
};
export default ContributionLink;
