import { Octokit } from "@octokit/rest";
import { ConfigWithContribution } from "./config";
import YAML from "yaml";

const testYaml = YAML.stringify([{ name: "hello" }]);

class MockOctokit {
  constructor() {}
  repos = {
    async getContent({ path }: { owner: string; repo: string; path: string }) {
      switch (path) {
        case "test/hello.json":
          return {
            data: {
              name: "hello.json",
              path: "test/hello.json",
              sha: "f2a886f39de7d36f08be433bdba1e47851752aa9",
              html_url:
                "https://github.com/Contribunator/Another/blob/main/test/hello.json",
              type: "file",
              content: "ewogICJoZWxsbyI6ICJ3b3JsZCIKfQo=\n",
            },
          };
        case "README.md":
          return {
            data: {
              name: "README.md",
              html_url:
                "https://github.com/Contribunator/Another/blob/main/README.md",
              path: "README.md",
              sha: "de8d415abb9dc949d702eac7b23021c410c4f09e",
              type: "file",
              content: Buffer.from("# Another").toString("base64"),
            },
          };
        case "links.yaml":
          return {
            data: {
              name: "README.md",
              html_url:
                "https://github.com/Contribunator/Another/blob/main/links.yaml",
              path: "README.md",
              sha: "whatever",
              type: "file",
              content: Buffer.from(testYaml).toString("base64"),
            },
          };
        default:
          throw { status: 404 };
      }
    },
  };
}

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
  isClient: boolean,
  OctokitModule = Octokit
): Promise<Files> {
  const { useFiles, useFilesOnClient, useFilesOnServer } = contribution;

  const usedFiles = {
    ...useFiles,
    ...(isClient ? useFilesOnClient : useFilesOnServer),
  };

  if (Object.keys(usedFiles).length === 0) {
    return {};
  }

  const octokit = new OctokitModule();
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
