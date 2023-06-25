import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "fields", contribution: "image" });

test("image field", async ({ f }) => {
  // basic
  const basic = f.getByLabel("Basic Image");
  await expect(basic).toHaveText("Basic ImagePNG or JPEG, up to 4.3MB");
  await f.uploadImage("Basic Image", "kitten.jpg");
  await expect(basic).toContainText("Confirm Crop");
  await expect(basic).toContainText("Remove");
  // click remove during crop
  await f.clickButton("Basic Image", "Remove");
  await expect(basic).toHaveText("Basic ImagePNG or JPEG, up to 4.3MB");
  // upload and crop
  await f.uploadAndCrop("Basic Image", "kitten.jpg");
  await expect(basic.getByAltText("Image Preview")).toBeVisible();
  await expect(basic).toHaveText("Basic Image Remove");
  // click remove
  await f.clickButton("Basic Image", "Remove");
  await expect(basic).toHaveText("Basic ImagePNG or JPEG, up to 4.3MB");
  await f.uploadAndCrop("Basic Image", "kitten.jpg");
  await expect(basic.getByAltText("Image Preview")).toBeVisible();
  // image full

  const fullTitle = "Image with full options";
  const full = f.getByLabel(fullTitle);
  await expect(full).toHaveText(
    "Image with full optionsInfo here, up to 0.5MBImage with full options is a required field"
  );
  await f.uploadAndCrop(fullTitle, "kitten.jpg");
  const alt = full.getByPlaceholder("Alt text");
  await expect(alt).toBeVisible();
  await alt.fill("My alt text");
  // images
  await expect(f.getByLabel("Basic Images (4 remaining)")).toHaveText(
    "Basic Images (4 remaining)PNG or JPEG, up to 4.3MB"
  );
  await f.uploadAndCrop(
    "Basic Images (4 remaining)",
    "kitten.jpg",
    "My Kitten"
  );
  await expect(f.getByLabel("Basic Images (3 remaining)")).toHaveText(
    "Basic Images (3 remaining)PNG or JPEG, up to 4.2MB"
  );
  await f.uploadAndCrop("Basic Images (3 remaining)", "dice.png");
  await expect(f.getByLabel("Basic Images (2 remaining)")).toHaveText(
    "Basic Images (2 remaining)PNG or JPEG, up to 4MB"
  );
  await f.uploadAndCrop("Basic Images (2 remaining)", "kitten.jpg");
  await expect(f.getByLabel("Basic Images (1 remaining)")).toHaveText(
    "Basic Images (1 remaining)PNG or JPEG, up to 3.9MB"
  );
  await f.uploadAndCrop("Basic Images (1 remaining)", "dice.png");
  await expect(f.getByLabel("Basic Images")).toHaveText(
    "Basic Images Remove Remove Remove Remove"
  );
  // // test removing...
  await f.getByLabel("Basic Images").getByText("Remove").nth(2).click();
  await expect(f.getByLabel("Basic Images (1 remaining)")).toHaveText(
    "Basic Images (1 remaining)PNG or JPEG, up to 3.7MB"
  );
  await f.uploadAndCrop("Basic Images (1 remaining)", "kitten.jpg");
  await expect(f.getByLabel("Basic Images")).toHaveText(
    "Basic Images Remove Remove Remove Remove"
  );
  // images full, with validation
  await expect(
    f
      .getByLabel("Images with full options (3 remaining)")
      .locator("..")
      .locator("..")
  ).toHaveText(
    "Images with full options (3 remaining)Info here, up to 1MBImages with full options is a required field"
  );
  await f.uploadAndCrop(
    "Images with full options (3 remaining)",
    "dice.png",
    "Some Dice"
  );
  await expect(
    f
      .getByLabel("Images with full options (2 remaining)")
      .locator("..")
      .locator("..")
  ).toHaveText(
    "RemoveImages with full options (2 remaining)Info here, up to 0.7MBImages with full options field must have at least 2 items"
  );
  await f.uploadAndCrop("Images with full options (2 remaining)", "kitten.jpg");
  await f.uploadAndCrop(
    "Images with full options (1 remaining)",
    "kitten.jpg",
    "kitten with alt"
  );

  await expect(f.getByLabel("Images with full options")).toHaveText(
    "Images with full options Remove Remove Remove"
  );

  expect(await f.submit()).toMatchObject({
    req: {
      imageBasic: {
        data: "data:image/jpeg;base64,[vM7xIELqet]",
        type: "jpeg",
      },
      imageFull: {
        alt: "My alt text",
        data: "data:image/jpeg;base64,[vM7xIELqet]",
        type: "jpeg",
      },
      imagesBasic: [
        {
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
        {
          data: "data:image/png;base64,[KncJzlfHSB]",
          type: "png",
        },
        {
          data: "data:image/png;base64,[KncJzlfHSB]",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
      ],
      imagesFull: [
        {
          alt: "Some Dice",
          data: "data:image/png;base64,[tYxXRKftKi]",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
        {
          alt: "kitten with alt",
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
      ],
    },
    res: {
      commit: {
        changes: [
          {
            files: {
              "1-imageBasic.jpeg": "blob,[XjjDgGJlB7]",
              "2-imageFull.jpeg": "blob,[XjjDgGJlB7]",
              "3-imagesBasic-0.jpeg": "blob,[XjjDgGJlB7]",
              "4-imagesBasic-1.png": "blob,[NMmsnTn0xi]",
              "5-imagesBasic-2.png": "blob,[NMmsnTn0xi]",
              "6-imagesBasic-3.jpeg": "blob,[XjjDgGJlB7]",
              "7-imagesFull-0.png": "blob,[iiqSwrdoe1]",
              "8-imagesFull-1.jpeg": "blob,[XjjDgGJlB7]",
              "9-imagesFull-2.jpeg": "blob,[XjjDgGJlB7]",
              "test.yaml": `imageBasic:
  data: "[image data]"
  type: jpeg
imageFull:
  data: "[image data]"
  type: jpeg
  alt: My alt text
imagesBasic:
  - data: "[image data]"
    type: jpeg
  - data: "[image data]"
    type: png
  - data: "[image data]"
    type: png
  - data: "[image data]"
    type: jpeg
imagesFull:
  - data: "[image data]"
    type: png
    alt: Some Dice
  - data: "[image data]"
    type: jpeg
  - data: "[image data]"
    type: jpeg
    alt: kitten with alt
`,
            },
          },
        ],
      },
      pr: {
        body: `This PR adds a new Image:

## Basic Image
✔

## Image with full options
✔

## Basic Images
4 item(s)

## Images with full options
3 item(s)${f.FOOTER}`,
      },
    },
  });
});
