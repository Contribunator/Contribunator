import { expect } from "@playwright/test";
import formTest, { FormFixture } from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "app" });

async function fillRequired(f: FormFixture) {
  await f.cannotSubmit([
    "App Category is a required field",
    "App Name is a required field",
    "URL to Launch App is a required field",
    "App Description is a required field",
    "Author Name is a required field",
  ]);

  await f.clickButton("App Category", "No Selection");
  await f.clickButton("App Category", "Games");

  await f.setText("App Name", "My Test App");
  await f.setText("URL to Launch App", "https://example.com");
  await f.setText("App Description", "Multline\n\nApp Description");
  await f.setText("Author Name", "Joe Bloggs");
}

test("app submits basic", async ({ f }) => {
  await fillRequired(f);
  // return;
  expect(await f.submit()).toEqual({
    req: {
      author: "Joe Bloggs",
      authorization: "anon",
      contribution: "app",
      description: `Multline

App Description`,
      repo: "TEST",
      title: "My Test App",
      type: "games",
      url: "https://example.com",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-app-my-test-app",
        changes: [
          {
            files: {
              "test/etc/apps.yaml": `- date: TIMESTAMP
  title: My Test App
  description: |-
    Multline

    App Description
  type: games
  author: Joe Bloggs
  links:
    - name: Launch App
      link: https://example.com
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
      icon: discord
`,
            },
            message: "Add App: My Test App",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds a new App:

## App Category
Games

## App Name
My Test App

## URL to Launch App
https://example.com

## App Description
Multline

App Description

## Author Name
Joe Bloggs${f.FOOTER}`,
        head: "c11r/timestamp-add-app-my-test-app",
        owner: "test-owner",
        repo: "TEST",
        title: "Add App: My Test App",
      },
    },
  });
});

test("app submits full", async ({ f }) => {
  await fillRequired(f);

  await f.uploadAndCrop("App Icon", "icon.png");

  await f.setText("Author Link", "https://author.link");
  await f.setText("Verified Contract Link", "https://verified.link");
  await f.setText("Link to Audit", "https://audit.link");
  await f.setText("Test Suite Link", "https://tests.link");
  await f.setText("IPFS Frontend", "https://ipfs.link");

  // other links
  await f.setText("Link Name", "https://link.name");
  await f.setText("Link URL", "https://link.url");

  await f.clickButton("Other Links (4 remaining)", "Add another link");

  await f.setText("Link Name", "https://link2.name");
  await f.setText("Link URL", "https://link2.url");

  await f
    .getByLabel("Link Icon")
    .locator(".btn-group > a:nth-child(3)")
    .click();

  // return;
  expect(await f.submit()).toEqual({
    req: {
      audit: "https://audit.link",
      author: "Joe Bloggs",
      authorLink: "https://author.link",
      authorization: "anon",
      contribution: "app",
      description: `Multline

App Description`,
      image: {
        data: "data:image/png;base64,iVBORw...",
        type: "png",
      },
      ipfsFrontend: "https://ipfs.link",
      links: [
        {
          link: "https://link.url",
          name: "https://link.name",
        },
        {
          link: "https://link2.url",
          name: "https://link2.name",
          icon: "book",
        },
      ],
      repo: "TEST",
      testSuite: "https://tests.link",
      title: "My Test App",
      type: "games",
      url: "https://example.com",
      verifiedContract: "https://verified.link",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-app-my-test-app",
        changes: [
          {
            files: {
              "content/services/apps/images/TIMESTAMP-my-test-app.png":
                "[converted:png:iVBORw]",
              "test/etc/apps.yaml": `- date: TIMESTAMP
  title: My Test App
  description: |-
    Multline

    App Description
  image: ./images/TIMESTAMP-my-test-app.png
  type: games
  author: Joe Bloggs
  authorLink: https://author.link
  verifiedContract: https://verified.link
  audit: https://audit.link
  testSuite: https://tests.link
  ipfsFrontend: https://ipfs.link
  links:
    - name: Launch App
      link: https://example.com
    - name: https://link.name
      link: https://link.url
    - name: https://link2.name
      link: https://link2.url
      icon: book
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
      icon: discord
`,
            },
            message: "Add App: My Test App",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds a new App:

## App Category
Games

## App Name
My Test App

## URL to Launch App
https://example.com

## App Description
Multline

App Description

## App Icon
![](https://raw.githubusercontent.com/test-owner/TEST/REPLACED_SHA/content/services/apps/images/TIMESTAMP-my-test-app.png)

## Author Name
Joe Bloggs

## Author Link
https://author.link

## Verified Contract Link
https://verified.link

## Link to Audit
https://audit.link

## Test Suite Link
https://tests.link

## IPFS Frontend
https://ipfs.link

### Other Links [1] Link Name
https://link.name

### Other Links [1] Link URL
https://link.url

### Other Links [2] Link Name
https://link2.name

### Other Links [2] Link URL
https://link2.url

### Other Links [2] Link Icon
book${f.FOOTER}`,
        head: "c11r/timestamp-add-app-my-test-app",
        owner: "test-owner",
        repo: "TEST",
        title: "Add App: My Test App",
      },
    },
  });
});
