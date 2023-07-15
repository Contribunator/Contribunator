import { createAppAuth } from "@octokit/auth-app";

import crypto from "crypto";

// @ts-ignore
import commitMultipleFiles from "octokit-commit-multiple-files";

import type {
  ConfigWithContribution,
  TransformedPR,
  Authorized,
  E2ETestResponse,
  GithubCreateCommit,
  GithubCreatePR,
} from "@/types";

import { e2e, githubApp } from "@/lib/env.server";

import log from "@/lib/log";
import { COMMIT_REPLACE_SHA } from "@/lib/constants";

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
  test?: E2ETestResponse;
}> {
  const githubUser = authorized.type === "github" ? authorized.token : null;
  // prevent branch name creation conflicts
  const uid = e2e ? "" : `-${crypto.randomBytes(3).toString("hex")}`;

  // get the base if it's not set
  const base =
    repo.base ||
    (
      await octokit.rest.repos.get({
        owner: repo.owner,
        repo: repo.name,
      })
    ).data.default_branch;

  const commit: GithubCreateCommit = {
    base,
    repo: repo.name,
    owner: repo.owner,
    branch: `${repo.branchPrefix}${branch}${uid}`,
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

  log.info("commit", { commit });
  const { commits } = await octokit.rest.repos.createOrUpdateFiles(commit);

  // get the commit sha and replace it in the PR body
  // so that images can be displayed
  const prMessage = message.split(COMMIT_REPLACE_SHA).join(commits[0].sha);

  const pr: GithubCreatePR = {
    base,
    title,
    repo: repo.name,
    head: commit.branch,
    owner: repo.owner,
    body: `${prMessage}${repo.prPostfix}`,
  };

  log.info("pr", { pr });
  const { data } = await octokit.rest.pulls.create(pr);

  // add tags and reviwer status
  await Promise.all([
    repo.addLabels &&
      octokit.rest.issues.addLabels({
        owner: repo.owner,
        repo: repo.name,
        issue_number: data.number,
        labels: repo.addLabels,
      }),
    (repo.requestReviewers?.teams || repo.requestReviewers?.users) &&
      octokit.rest.pulls.requestReviewers({
        owner: repo.owner,
        repo: repo.name,
        pull_number: data.number,
        ...(repo.requestReviewers.teams && {
          team_reviewers: repo.requestReviewers.teams,
        }),
        ...(repo.requestReviewers.users && {
          reviewers: repo.requestReviewers.users,
        }),
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
