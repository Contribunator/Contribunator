import { ConfigWithContribution } from "@/lib/config";
import { GenericConfig } from "./config";
import Link from "next/link";
import { Route } from "next";

type Props = {
  children: React.ReactNode;
  // TODO ConfigWithContribution<GenericConfig>
  config: ConfigWithContribution & { contribution: GenericConfig };
};

export default function GenericFormContainer({
  children,
  config: { contribution, repo },
  ...props
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <h2 className="title">
          {contribution.options.title || contribution.title}
        </h2>
        <div>
          {contribution.options.description || contribution.description}
        </div>
        <div className="text-sm">
          Submits a Pull Request to{" "}
          <Link
            className="hover:underline"
            target="_blank"
            href={repo.githubUrl as Route}
          >
            {repo.githubUrl}
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
