import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitMultipleFiles from "octokit-commit-multiple-files";

import type {
  ConfigWithContribution,
  TransformedPR,
  Authorized,
} from "@/types";

import { e2e, githubApp } from "@/lib/env.server";

import Octokit from "./octokit";

const OctokitPlugin = Octokit.plugin(commitMultipleFiles);

const octokit = new OctokitPlugin({
  authStrategy: createAppAuth,
  auth: githubApp,
});

export type CreatePullRequestInputs = {
  authorized: Authorized;
  config: ConfigWithContribution;
  transformed: TransformedPR;
};

export type CreatePullRequestOutputs = {
  url: string;
  number: number;
  title: string;
};

export default async function submitPullRequest({
  authorized,
  config: { repo },
  transformed: { files, title, branch, message },
}: CreatePullRequestInputs): Promise<{
  pr: CreatePullRequestOutputs;
  test: any; // for testing
}> {
  const prMessage = `${message}${repo.prPostfix}`;
  const githubUser = authorized.type === "github" ? authorized.token : null;
  const commit = {
    repo: repo.name,
    owner: repo.owner,
    branch: `${repo.branchPrefix}${branch}`,
    createBranch: true,
    ...(githubUser && {
      author: {
        name: githubUser.name || githubUser.login,
        email:
          githubUser.email || `${githubUser.login}@users.noreply.github.com`,
      },
    }),
    changes: [
      {
        message: title,
        files,
      },
    ],
  };

  console.log("commit", commit);
  console.log("files", files);
  await octokit.rest.repos.createOrUpdateFiles(commit);

  const pr = {
    base: repo.base,
    title,
    repo: repo.name,
    head: commit.branch,
    owner: repo.owner,
    body: prMessage,
  };

  console.log("pr", pr);
  const { data } = await octokit.rest.pulls.create(pr);

  // add tags and reviwer status
  await Promise.all([
    repo.addLabels &&
      octokit.rest.issues.addLabels({
        owner: repo.owner,
        repo: repo.name,
        issue_number: data.number,
        labels: repo.addLabels.map((name) => ({ name })),
      }),
    (repo.requestReviewers?.teams || repo.requestReviewers?.users) &&
      octokit.rest.pulls.requestReviewers({
        owner: repo.owner,
        repo: repo.name,
        pull_number: data.number,
        reviewers: {
          ...(repo.requestReviewers.teams && {
            team_reviewers: repo.requestReviewers.teams,
          }),
          ...(repo.requestReviewers.users && {
            reviewers: repo.requestReviewers.users,
          }),
        },
      }),
  ]);

  return {
    pr: {
      url: data.html_url,
      number: data.number,
      title: data.title,
    },
    // in test mode return the submitted commit and data
    test: e2e ? { pr, commit } : undefined,
  };
}
