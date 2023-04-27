import { HiCode } from "react-icons/hi";
import Link from "next/link";
import { C11RContribution } from "@/types";

type Props = {
  contribution: C11RContribution;
  repo: string;
};

const ContributionLink = ({
  contribution: { icon, type, options, name, description },
  repo,
}: Props) => {
  const Icon = icon || HiCode;
  return (
    <Link
      href={{
        pathname: `/contribute/${repo}/${type}`,
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
