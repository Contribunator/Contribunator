import YAML from "yaml";

import Octokit from "@/lib/octokit";

import { ConfigWithContribution } from "./config";

const octokit = new Octokit();

export type File = {
  name: string;
  path: string;
  sha?: string;
  url?: string;
  type?: string;
  exists: boolean;
  content?: string;
  parsed?: any;
};

export type Files = { [name: string]: File };

export default async function fetchFiles(
  { owner, repo, contribution }: ConfigWithContribution,
  isClient: boolean
): Promise<Files> {
  const { useFiles, useFilesOnClient, useFilesOnServer } = contribution;

  const usedFiles = {
    ...useFiles,
    ...(isClient ? useFilesOnClient : useFilesOnServer),
  };

  if (Object.keys(usedFiles).length === 0) {
    return {};
  }

  return (
    await Promise.all(
      Object.entries(usedFiles).map(async ([name, path]) => {
        const file = { name, path };
        try {
          const { data } = await octokit.repos.getContent({
            owner,
            repo: repo.name,
            path,
          });
          // if it's a directory
          if (Array.isArray(data)) {
            return {
              ...file,
              exists: true,
              dir: true,
              content: data.map(({ name, html_url: url, path, sha, type }) => {
                return { name, url, path, sha, type };
              }),
            };
          } else if (data.type === "file") {
            const content = Buffer.from(data.content, "base64").toString();
            const fileData: File = {
              ...file,
              sha: data.sha,
              url: data.html_url || undefined,
              type: data.type,
              exists: true,
              content,
            };
            if (file.path.endsWith(".json")) {
              fileData.parsed = JSON.parse(content);
            }
            if (file.path.endsWith(".yaml") || file.path.endsWith(".yml")) {
              fileData.parsed = YAML.parse(content);
            }
            return fileData;
          } else {
            throw new Error(`Unknown file type ${data.type}`);
          }
        } catch (e: any) {
          if (e.status === 404) {
            return { ...file, exists: false };
          } else {
            throw e;
          }
        }
      })
    )
  ).reduce((o, file) => ({ ...o, [file.name]: file }), {});
}
