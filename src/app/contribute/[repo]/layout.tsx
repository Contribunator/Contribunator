import { octokit } from "@/octokit";

type Props = {
  children: React.ReactNode;
  params: {
    repo: string;
    type: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

export default function Contribution(props: Props) {
  const {
    params: { repo, type },
    searchParams: query,
    children,
  } = props;

  return (
    <div>
      <div>CONTRIBUUTION LAYOUT (TODO, GET REPO INFO, SELECT TYPE)</div>
      {children}
    </div>
  );
}
