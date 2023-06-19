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
      if (path === "test/data/news.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `# Existing Test
- date: 2023-02-01
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
      if (path === "test/data/videos.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `# Existing Test
- title: "Test Video"
  date: 2022-02-08
  uploaded: 2022-02-08
  youtube: o4n6pqRyA1c
  tags: ["discussions", "explainers"]
  author: Existing Author
  authorYoutube: c/channel_name
  description: my description here`
            ).toString("base64"),
          },
        };
      }

      if (path === "test/data/apps.yaml") {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `# Existing Test
- title: Existing App
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
      icon: discord`
            ).toString("base64"),
          },
        };
      }

      if (path.startsWith("content/")) {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `# Existing Test
items:              
  web:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  browsers:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  hardware:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  software:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  other:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Trust-Minimizing Exchanges:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Centralized Spot Markets:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Centralized Derivative Markets:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Cross-Chain Swap Exchanges:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  NFT Marketplaces:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Other:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Chat Rooms:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Development Chat:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Telegram Groups:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Forums:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Media:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Twitter Accounts:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Regional Website:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  prices:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  processors:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  dex:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  endpoints:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  pools:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  explorers:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  monitors:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  repos:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com`
            ).toString("base64"),
          },
        };
      }

      return { status: 404 };
    },
  };
}

// @ts-ignore
Mocktokit.plugin = () => Mocktokit;

export default Mocktokit;
