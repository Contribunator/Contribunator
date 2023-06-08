// TODO test with genreated title
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
      if (path === "test/data/news.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `- date: 2023-02-01
  link: https://example.com/
  title: "Test news item"
  tags: ["announcement"]
- date: 2022-09-08
  link: https://test.com/
  author: Autho Test
  source: Source Test
  title: "This is some weird title."
  tags: ["food", "information"] `
            ).toString("base64"),
          },
        };
      }

      if (path === "test/data/apps.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `- title: Antoher Exiting App
  date: 2023-03-05
  image: ./some/image.png
  author: Some Some AUthor
  authorLink: https://github.com/link
  verifiedContract: https://blockscout.com/etc/mainnet/address/
  description: Test description
  type: finance
  links:
    - name: Twitter
      link: https://twitter.com/xxx
      icon: twitter
    - name: Telegram
      link: https://t.me/xxx
      icon: telegram
    - name: Discord
      link: https://discord.com/invite/xxx
      icon: discord
- title: Example Exiting App
  date: 2023-03-03
  image: ./some/image.png
  author: Some Some AUthor
  authorLink: https://github.com/link
  verifiedContract: https://blockscout.com/etc/mainnet/address/
  description: Test description
  type: finance
  links:
    - name: Twitter
      link: https://twitter.com/xxx
      icon: twitter
    - name: Telegram
      link: https://t.me/xxx
      icon: telegram
    - name: Discord
      link: https://discord.com/invite/xxx
      icon: discord`
            ).toString("base64"),
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
