import Link from "next/link";

import type { Route } from "next";
import type { ConfigWithContribution } from "@/types";

type Props = {
  children: React.ReactNode;
  config: ConfigWithContribution;
};

export default function FormContainer({
  children,
  config: { contribution, repo },
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <h2 className="title">
          {contribution.form.title || contribution.title}
        </h2>
        <div>{contribution.form.description || contribution.description}</div>
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
