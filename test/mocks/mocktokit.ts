// TODO test with genreated title
import fs from "fs/promises";
import { join } from "path";

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
      createOrUpdateFiles: async () => {
        // noop
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
        console.log({ reviewers, team_reviewers });
      },
    },
    issues: {
      addLabels: async ({ labels }: any) => {
        // noop
        console.log({ labels });
      },
    },
  };

  // test fetchFiles
  repos = {
    async getContent({ path }: { path: string }) {
      try {
        // reject strings that don't start with test
        if (!path.startsWith("test/")) {
          throw new Error("Warning: Not requesting test data");
        }
        // read data from test/data
        const fileName = join(
          process.cwd(),
          "test/assets/data",
          path.replace("test/", "")
        );
        const data = await fs.readFile(fileName, { encoding: "utf8" });
        return {
          data: {
            type: "file",
            content: Buffer.from(data).toString("base64"),
          },
        };
      } catch (e) {
        console.log(e);
        return { status: 404 };
      }
    },
  };
}

// @ts-ignore
Mocktokit.plugin = () => Mocktokit;

export default Mocktokit;
