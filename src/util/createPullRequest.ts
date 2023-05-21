import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";

import config, { getRepoConfig } from "@/util/config";
import { Authorized } from "@/util/authorize";
import { appId, installationId, privateKey } from "@/util/env";

const OctokitPlugin = Octokit.plugin(commitPlugin);

const octokit = new OctokitPlugin({
  authStrategy: createAppAuth,
  auth: {
    appId,
    installationId,
    privateKey,
  },
});

export default async function createPullRequest({
  // todo make this more explicit, the token might not always be a github token
  authorized,
  repo,
  files,
  name,
  branch,
  message,
}: {
  authorized: Authorized;
  repo: string;
  message?: string;
  name: string;
  branch: string;
  files: {
    [key: string]: string;
  };
}) {
  const { base, branchPrefix, owner } = getRepoConfig(repo);

  const title = name;
  const prMessage = `${message || "Automated Pull Request"}${config.prPostfix}`;

  const githubUser = authorized.type === "github" ? authorized.token : null;

  const commit = {
    repo,
    owner: owner,
    branch: `${branchPrefix}${branch}`,
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
  await octokit.rest.repos.createOrUpdateFiles(commit);

  const pr = {
    repo,
    base,
    title,
    head: commit.branch,
    owner: owner,
    body: prMessage,
  };

  let prOctokit = octokit;

  // create the PR as the user if they are logged in, otherwise as the app
  if (githubUser) {
    prOctokit = new Octokit({ auth: githubUser.accessToken });
  }

  console.log("pr", pr);
  const prResponse = await prOctokit.rest.pulls.create(pr);
  // return "test ok";
  return prResponse.data.html_url;
}
