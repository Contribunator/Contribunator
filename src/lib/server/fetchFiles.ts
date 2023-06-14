import YAML from "yaml";

import Octokit from "./octokit";

import { ConfigWithContribution, FetchedFile, FetchedFiles } from "@/types";

const octokit = new Octokit();

export default async function fetchFiles(
  {
    config: { owner, repo, contribution },
    body,
  }: { config: ConfigWithContribution; body: any },
  isClient: boolean = false
): Promise<FetchedFiles> {
  const { useFiles, useFilesOnClient, useFilesOnServer } = contribution;

  let usedFiles: { [key: string]: string } = {};

  // if a function is provided, call it with the body
  [useFiles, isClient ? useFilesOnClient : useFilesOnServer].forEach(
    (filesConfig) => {
      if (typeof filesConfig === "function") {
        usedFiles = { ...usedFiles, ...filesConfig(body) };
      } else {
        usedFiles = { ...usedFiles, ...filesConfig };
      }
    }
  );

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
          // TODO handle file doesn't exist,
          // TODO test with real API
          if (!data) {
            // throw Error(`Error fetching file ${path}`);
            return { ...file, exists: false };
          }
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
            const fileData: FetchedFile = {
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
          // TODO we need to detect if there's a 404 error
          // or a rate limit error or something else
          // TODO handle API rate lmiting and other errors
          console.log(e);
          if (e.status === 404) {
            return { ...file, exists: false };
          }
          throw e;
        }
      })
    )
  ).reduce((o, file) => ({ ...o, [file.name]: file }), {});
}
