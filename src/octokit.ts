import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
// @ts-ignore
import commitPlugin from "octokit-commit-multiple-files";
import config, { getRepoConfig } from "@/config";
import slugify from "slugify";

const octokitOptions = {
  authStrategy: createAppAuth,
  auth: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    appId: parseInt(process.env.GITHUB_APP_ID as string),
    installationId: parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string),
    privateKey: process.env.GITHUB_APP_PK as string,
  },
  // auth: token.accessToken // TODO if we want to impersonate user?
};

export async function getRepoData(repo: string) {
  const octokit = new Octokit(octokitOptions);
  const { data } = await octokit.repos.get({ repo, owner: config.owner });
  return data;
}

export async function createPullRequest({
  repo,
  files,
  name,
  branch,
}: {
  repo: string;
  name: string;
  branch: string;
  files: {
    [key: string]: string;
  };
}) {
  // TODO validation
  // TODO CAPTCH
  // const repoConfig = await getRepoConfig(repo);
  const repoData = await getRepoData(repo);

  const OctokitPlugin = Octokit.plugin(commitPlugin);
  const octokit = new OctokitPlugin(octokitOptions);

  // TODO validaiton based on config file, don't let people push to any repo obvs...
  const head = `c11r/${branch}`;

  // TODO config mesasge based on PR type
  const message = `Add ${name}`;

  await octokit.rest.repos.createOrUpdateFiles({
    repo,
    owner: config.owner,
    branch: head,
    createBranch: true,
    changes: [
      {
        message,
        files,
      },
    ],
  });

  const {
    data: { html_url: url },
  } = await octokit.pulls.create({
    repo,
    head,
    owner: config.owner,
    // TODO make it configurable
    base: repoData.default_branch,
    title: message,
    body: "This PR was created by a bot, todo some message...", // TODO some AI?
  });

  // todo error handling
  return url;
}
