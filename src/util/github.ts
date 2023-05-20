import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";

import { getRepoConfig } from "@/util/config";
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

export async function createPullRequest({
  // todo make this more explicit, the token might not always be a github token
  authorized,
  repo,
  files,
  name,
  branch,
}: {
  authorized: Authorized;
  repo: string;
  name: string;
  branch: string;
  files: {
    [key: string]: string;
  };
}) {
  const { base, branchPrefix, owner } = await getRepoConfig(repo);
  const message = `Add ${name}`;

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
        message,
        files,
      },
    ],
  };

  console.log("commit", commit);
  await octokit.rest.repos.createOrUpdateFiles(commit);

  const pr = {
    repo,
    base,
    head: commit.branch,
    owner: owner,
    title: message,
    body: `This Pull Request was created via the Contribunator Bot`,
  };

  let prOctokit = octokit;

  // create the PR as the user if they are logged in, otherwise as the app
  if (githubUser) {
    prOctokit = new Octokit({ auth: githubUser.accessToken });
  }

  console.log("pr", pr);
  const prResponse = await prOctokit.rest.pulls.create(pr);

  return prResponse.data.html_url;
}
