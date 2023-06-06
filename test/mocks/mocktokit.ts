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
            html_url: "https://github.com/test/test/pull/1",
            title: "Test PR",
            number: 1,
          },
        };
      },
    },
  };

  // test fetchFiles
  repos = {
    async getContent({ path }: { path: string }) {
      if (path === "test.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from("hello: world").toString("base64"),
          },
        };
      }
      if (path === "test.json") {
        return {
          data: {
            type: "file",
            content: Buffer.from(JSON.stringify({ hello: "world" })).toString(
              "base64"
            ),
          },
        };
      }
      return { status: 404 };
    },
  };
}

Mocktokit.plugin = () => {
  return Mocktokit;
};

export default Mocktokit;
