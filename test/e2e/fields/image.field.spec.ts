import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "_E2E_fields", contribution: "image" });

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
      contribution: "image",
      imageBasic: {
        data: "data:image/jpeg;base64,/9j/4A...",
        type: "jpeg",
      },
      imageFull: {
        alt: "My alt text",
        data: "data:image/jpeg;base64,/9j/4A...",
        type: "jpeg",
      },
      imagesBasic: [
        {
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
        {
          data: "data:image/png;base64,iVBORw...",
          type: "png",
        },
        {
          data: "data:image/png;base64,iVBORw...",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
      ],
      imagesFull: [
        {
          alt: "Some Dice",
          data: "data:image/png;base64,iVBORw...",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
        {
          alt: "kitten with alt",
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
      ],
    },
    res: {
      commit: {
        changes: [
          {
            files: {
              "media/TIMESTAMP-image-basic-image.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/TIMESTAMP-image-basic-images-1.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/TIMESTAMP-image-basic-images-2.png":
                "[converted:png:iVBORw]",
              "media/TIMESTAMP-image-basic-images-3.png":
                "[converted:png:iVBORw]",
              "media/TIMESTAMP-image-basic-images-4.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/TIMESTAMP-image-image-with-full-options-my-alt-text.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/TIMESTAMP-image-images-with-full-options-1-some-dice.png":
                "[converted:png:iVBORw]",
              "media/TIMESTAMP-image-images-with-full-options-2.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/TIMESTAMP-image-images-with-full-options-3-kitten-with-alt.jpeg":
                "[converted:jpeg:/9j/4A]",
              "test.yaml": `imageBasic:
  data: data:image/jpeg;base64,/9j/4A...
  type: jpeg
imageFull:
  data: data:image/jpeg;base64,/9j/4A...
  type: jpeg
  alt: My alt text
imagesBasic:
  - data: data:image/jpeg;base64,/9j/4A...
    type: jpeg
  - data: data:image/png;base64,iVBORw...
    type: png
  - data: data:image/png;base64,iVBORw...
    type: png
  - data: data:image/jpeg;base64,/9j/4A...
    type: jpeg
imagesFull:
  - data: data:image/png;base64,iVBORw...
    type: png
    alt: Some Dice
  - data: data:image/jpeg;base64,/9j/4A...
    type: jpeg
  - data: data:image/jpeg;base64,/9j/4A...
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
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-basic-image.jpeg)

## Image with full options
![My alt text](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-image-with-full-options-my-alt-text.jpeg)
*My alt text*

## Basic Images [1]
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-basic-images-1.jpeg)

## Basic Images [2]
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-basic-images-2.png)

## Basic Images [3]
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-basic-images-3.png)

## Basic Images [4]
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-basic-images-4.jpeg)

## Images with full options [1]
![Some Dice](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-images-with-full-options-1-some-dice.png)
*Some Dice*

## Images with full options [2]
![](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-images-with-full-options-2.jpeg)

## Images with full options [3]
![kitten with alt](https://raw.githubusercontent.com/test-owner/_E2E_fields/REPLACED_SHA/media/TIMESTAMP-image-images-with-full-options-3-kitten-with-alt.jpeg)
*kitten with alt*${f.FOOTER}`,
      },
    },
  });
});
