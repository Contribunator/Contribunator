import { join } from "path";
import fs from "fs/promises";

export const testPr = {
  url: "https://github.com/repo/owner/pulls/123",
  number: 123,
  title: "This is my test commit",
};

class Mocktokit {
  constructor() {}

  // test pullRequestHandler
  rest = {
    repos: {
      get: async ({}) => {
        return {
          data: {
            default_branch: "main",
          },
        };
      },
      createOrUpdateFiles: async ({ base }: any) => {
        return {
          base: base || "main",
          commits: [
            {
              sha: "REPLACED_SHA",
            },
          ],
        };
      },
    },
    pulls: {
      create: async (data: any) => {
        return {
          test: data,
          data: {
            html_url: testPr.url,
            title: testPr.title,
            number: testPr.number,
          },
        };
      },
      requestReviewers: async ({ reviewers, team_reviewers }: any) => {
        // noop
        // log.info({ reviewers, team_reviewers });
      },
    },
    issues: {
      addLabels: async ({ labels }: any) => {
        // noop
        // log.info({ labels });
      },
    },
  };

  // test fetchFiles
  repos = {
    async getContent({ path }: { path: string }) {
      // return 404s
      if (path.split("/").pop()?.split(".")[0] === "404") {
        return { status: 404 };
      }
      // core tests are prefixed with _E2E_/, otherwise assume usertest
      const relPath = path.startsWith("_E2E_/")
        ? `test/assets/data/${path.replace("_E2E_/", "")}`
        : `contributions/test/data/${path}`;

      const fileName = join(process.cwd(), relPath);
      try {
        const data = await fs.readFile(fileName, { encoding: "utf8" });
        return {
          data: {
            type: "file",
            content: Buffer.from(data).toString("base64"),
          },
        };
      } catch (e) {
        throw Error(`Test data not found [${path} -> ${fileName}]`);
      }
    },
  };
}

// @ts-ignore
Mocktokit.plugin = () => Mocktokit;

export default Mocktokit;
