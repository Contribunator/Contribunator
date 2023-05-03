import { HiCode } from "react-icons/hi";
import Link from "next/link";
import { C11RRepo, C11RContribution } from "@/config";

type Props = {
  contribution: C11RContribution;
  repo: C11RRepo;
};

const ContributionLink = ({
  contribution: { icon, type, options, name, description },
  repo,
}: Props) => {
  const Icon = icon || HiCode;
  return (
    <Link
      className="p-2"
      href={{
        pathname: `/contribute/${repo.name}/${type}`,
        query: options,
      }}
    >
      <Icon />
      <div>{name}</div>
      <div>{description}</div>
    </Link>
  );
};
export default ContributionLink;
