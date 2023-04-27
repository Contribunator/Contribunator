import { HiCode } from "react-icons/hi";
import { C11RContribution, C11RRepo } from "../../config";
import Link from "next/link";

type Props = {
  contribution: C11RContribution;
  repo: Omit<C11RRepo, "contributions">;
  owner: string;
};

const encodeGetParams = (p) =>
  Object.entries(p)
    .map((kv) => kv.map(encodeURIComponent).join("="))
    .join("&");

const Type = ({ contribution, repo, owner }: Props) => {
  // const { contriution: props }
  const Icon = contribution.icon || HiCode;
  let url = `/contribute/${repo.repo}/${contribution.type}`;
  if (contribution.options) {
    url = `${url}?${encodeGetParams(contribution.options)}`;
  }
  return (
    <Link href={url}>
      <Icon />
      <div>{JSON.stringify({ contribution, repo, owner }, null, 2)}</div>
    </Link>
  );
};
export default Type;
