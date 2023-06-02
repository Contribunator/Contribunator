import { Octokit } from "@octokit/rest";
import { ConfigWithContribution } from "./config";

class MockOctokit {
  constructor() {}
  repos = {
    async getContent({ path }: { owner: string; repo: string; path: string }) {
      switch (path) {
        case "test":
          return {
            data: [
              {
                name: "hello.json",
                html_url:
                  "https://github.com/Contribunator/Another/blob/main/test/hello.json",
                path: "test/hello.json",
                sha: "f2a886f39de7d36f08be433bdba1e47851752aa9",
                type: "file",
              },
            ],
          };
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
        case "test.json":
          throw { status: 404 };
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
        default:
          throw new Error(`Unknown path: ${path}`);
      }
    },
  };
}

export default async function fetchFiles(
  { owner, repo, repo: { contribution } }: ConfigWithContribution,
  OctokitModule = MockOctokit
) {
  const { useFiles } = contribution.options || {};
  if (!useFiles) {
    return null;
  }

  const octokit = new OctokitModule();
  return (
    await Promise.all(
      Object.entries(useFiles).map(async ([name, path]) => {
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
            console.log(file, data);
            const content = Buffer.from(data.content, "base64").toString();
            return {
              ...file,
              sha: data.sha,
              url: data.html_url,
              type: data.type,
              exists: true,
              content,
            };
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

  // return { hello: "world" };
}
