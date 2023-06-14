// TODO test with genreated title
export const testPr = {
  url: "https://github.com/repo/owner/pulls/123",
  number: 123,
  title: "This is my test commit",
};

export const NEWS_COLLECTION = "test/data/news.yaml";
export const APPS_COLLECTION = "test/data/apps.yaml";
export const LINKS_DIR = "content/";

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
      if (path === NEWS_COLLECTION) {
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

      if (path === APPS_COLLECTION) {
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

      if (path.startsWith(LINKS_DIR)) {
        return {
          data: {
            type: "file",
            content: Buffer.from(
              `# Existing Test
items:              
  web:
    items:
      - __name: Existing Test
        __link: https://example.com
  browsers:
    items:
      - __name: Existing Test
        __link: https://example.com
  hardware:
    items:
      - __name: Existing Test
        __link: https://example.com
  software:
    items:
      - __name: Existing Test
        __link: https://example.com
  other:
    items:
      - __name: Existing Test
        __link: https://example.com
  Trust-Minimizing Exchanges:
    items:
      - __name: Existing Test
        __link: https://example.com
  Centralized Spot Markets:
    items:
      - __name: Existing Test
        __link: https://example.com
  Centralized Derivative Markets:
    items:
      - __name: Existing Test
        __link: https://example.com
  Cross-Chain Swap Exchanges:
    items:
      - __name: Existing Test
        __link: https://example.com
  NFT Marketplaces:
    items:
      - __name: Existing Test
        __link: https://example.com
  Other:
    items:
      - __name: Existing Test
        __link: https://example.com
  Chat Rooms:
    items:
      - __name: Existing Test
        __link: https://example.com
  Development Chat:
    items:
      - __name: Existing Test
        __link: https://example.com
  Telegram Groups:
    items:
      - __name: Existing Test
        __link: https://example.com
  Forums:
    items:
      - __name: Existing Test
        __link: https://example.com
  Media:
    items:
      - __name: Existing Test
        __link: https://example.com
  Twitter Accounts:
    items:
      - __name: Existing Test
        __link: https://example.com
  Regional Website:
    items:
      - __name: Existing Test
        __link: https://example.com
  prices:
    items:
      - __name: Existing Test
        __link: https://example.com
  processors:
    items:
      - __name: Existing Test
        __link: https://example.com
  dex:
    items:
      - __name: Existing Test
        __link: https://example.com
  endpoints:
    items:
      - __name: Existing Test
        __link: https://example.com
  pools:
    items:
      - __name: Existing Test
        __link: https://example.com
  explorers:
    items:
      - __name: Existing Test
        __link: https://example.com
  monitors:
    items:
      - __name: Existing Test
        __link: https://example.com
  repos:
    items:
      - __name: Existing Test
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
