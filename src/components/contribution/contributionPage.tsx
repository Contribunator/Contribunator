import React from "react";
import { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import getConfig from "@/lib/config";
import useUser from "@/components/common/useUser";
import UserInfo from "@/components/common/userInfo";

import FormClient from "./formClient";

// TODO crud
// import fetchFiles from "@/lib/fetchFiles";

type PageProps = {
  params: {
    repo: string;
    contribution: string;
  };
};

export default async function FormPage({
  params: { repo, contribution },
}: PageProps) {
  let config;
  try {
    config = await getConfig(repo, contribution);
  } catch {
    notFound();
  }
  const user = await useUser();

  // TODO dynamic fetch on client side
  // await fetchFiles({config, fields}, true);
  const files = {};

  return (
    <>
      <UserInfo authorization={config.repo.authorization} />
      <div className="space-y-2">
        <h2 className="title">
          {config.contribution.form.title || config.contribution.title}
        </h2>
        <div className="text-sm">
          {config.contribution.form.description ||
            config.contribution.description}
        </div>
        <div className="text-sm">
          Submits a Pull Request to{" "}
          <Link
            className="hover:underline"
            target="_blank"
            href={config.repo.githubUrl as Route}
          >
            {config.repo.githubUrl}
          </Link>
          .
        </div>
      </div>
      {/* needs to be rendered seperately because it's a client side component */}
      {/* we can't pass the whole config directly; just pass names, and it gets queried again client side */}
      {/* @ts-ignore */}
      <FormClient {...{ repo, user, contribution, files }} />
    </>
  );
}
