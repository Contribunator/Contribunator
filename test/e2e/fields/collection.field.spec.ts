import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "fields", contribution: "collection" });

test("collection field", async ({ f }) => {
  //
  // basic
  //
  const bc = "Basic Collection";
  await expect(f.getByLabel(bc)).toHaveText(`${bc}Basic Text`);
  await f.setCollectionText(bc, [0, "Basic Text"], "Hello World");
  await expect(f.getByLabel(bc)).toHaveText(`${bc}Basic Text RemoveBasic Text`);
  await f.setCollectionText(bc, [1, "Basic Text"], "Hello World Again");
  await expect(f.getByLabel(bc)).toHaveText(
    `${bc}Basic Text RemoveBasic Text RemoveBasic Text`
  );
  await f.setCollectionText(bc, [0, "Basic Text"], "Hello World Modified");
  await f.getCollection(bc, [0]).getByText("Remove").click();
  await expect(f.getByLabel(bc)).toHaveText(`${bc}Basic Text RemoveBasic Text`);
  //
  // collectionWithButton
  //
  // should not auto-populate, but show button instead
  // button only appears after entering text
  const rcwb = "Required Collection with button";
  await expect(f.getByLabel(rcwb)).toHaveText(
    `${rcwb}${rcwb} is a required fieldBasic Text`
  );
  await f.setCollectionText(rcwb, [0, "Basic Text"], "Hello World 2");
  await expect(f.getByLabel(rcwb)).toHaveText(
    `${rcwb}Basic Text RemoveAdd a new item`
  );
  await f.getByLabel(rcwb).getByText("Add a new item").click();
  await expect(f.getByLabel(rcwb)).toHaveText(
    `${rcwb}Basic Text RemoveBasic Text Remove`
  );
  await f.setCollectionText(rcwb, [1, "Basic Text"], "Hello World 3");
  await expect(f.getByLabel(rcwb)).toHaveText(
    `${rcwb}Basic Text RemoveBasic Text RemoveAdd a new item`
  );
  //
  // collectionWithLimit
  //
  const cwlm = "Collection with limit and min";
  await expect(f.getByLabel(`${cwlm} (3 remaining)`)).toHaveText(
    `${cwlm} (3 remaining)Basic Text`
  );
  await f.setCollectionText(`${cwlm} (3 remaining)`, [0, "Basic Text"], "Uno");
  await expect(f.getByLabel(`${cwlm} (2 remaining)`)).toHaveText(
    `${cwlm} (2 remaining)${cwlm} field must have at least 2 itemsBasic Text RemoveBasic Text`
  );
  await f.setCollectionText(`${cwlm} (2 remaining)`, [1, "Basic Text"], "Dos");
  await expect(f.getByLabel(`${cwlm} (1 remaining)`)).toHaveText(
    `${cwlm} (1 remaining)Basic Text RemoveBasic Text RemoveBasic Text`
  );
  await f.setCollectionText(`${cwlm} (1 remaining)`, [2, "Basic Text"], "Tres");
  await expect(f.getByLabel(`${cwlm} (0 remaining)`)).toHaveText(
    `${cwlm} (0 remaining)Basic Text RemoveBasic Text RemoveBasic Text Remove`
  );
  //
  // collectionWithLimitButton
  //
  const cwblm = "Collection with button, required limit and min";
  await expect(f.getByLabel(`${cwblm} (3 remaining)`)).toHaveText(
    `${cwblm} (3 remaining)${cwblm} is a required fieldBasic Required`
  );
  await f.setCollectionText(
    `${cwblm} (3 remaining)`,
    [0, "Basic Required"],
    "One"
  );
  await expect(f.getByLabel(`${cwblm} (2 remaining)`)).toHaveText(
    `${cwblm} (2 remaining)${cwblm} field must have at least 2 itemsBasic Required RemoveAdd Item`
  );

  await f.getByLabel(`${cwblm} (2 remaining)`).getByText("Add item").click();
  await expect(f.getByLabel(`${cwblm} (1 remaining)`)).toHaveText(
    `${cwblm} (1 remaining)Basic Required RemoveBasic RequiredBasic Required is a required field Remove`
  );
  await f.setCollectionText(
    `${cwblm} (1 remaining)`,
    [1, "Basic Required"],
    "Two"
  );
  await expect(f.getByLabel(`${cwblm} (1 remaining)`)).toHaveText(
    `${cwblm} (1 remaining)Basic Required RemoveBasic Required RemoveAdd Item`
  );
  await f.getByLabel(`${cwblm} (1 remaining)`).getByText("Add item").click();

  await expect(f.getByLabel(`${cwblm} (0 remaining)`)).toHaveText(
    `${cwblm} (0 remaining)Basic Required RemoveBasic Required RemoveBasic RequiredBasic Required is a required field Remove`
  );
  await f.setCollectionText(
    `${cwblm} (0 remaining)`,
    [2, "Basic Required"],
    "Three"
  );
  await expect(f.getByLabel(`${cwblm} (0 remaining)`)).toHaveText(
    `${cwblm} (0 remaining)Basic Required RemoveBasic Required RemoveBasic Required Remove`
  );
  await f
    .getCollection(`${cwblm} (0 remaining)`, [1])
    .getByText("Remove")
    .click();
  await expect(f.getByLabel(`${cwblm} (1 remaining)`)).toHaveText(
    `${cwblm} (1 remaining)Basic Required RemoveBasic Required RemoveAdd Item`
  );
  //
  // subCollection
  //
  const sc = "Sub Collection Basic";
  const scsc = "Sub Collection";
  await expect(f.getByLabel(sc)).toHaveText(`${sc}Basic Text${scsc}Sub Text`);
  await f.setCollectionText(sc, [0, "Basic Text"], "Sub Text 1");
  await f.setCollectionText(sc, [0, scsc, 0, "Sub Text"], "Sub Sub Text 1");
  await f.setCollectionText(sc, [0, scsc, 1, "Sub Text"], "Sub Sub Text 2");
  await expect(f.getByLabel(sc)).toHaveText(
    `${sc}Basic Text${scsc}Sub Text RemoveSub Text RemoveSub Text RemoveBasic Text${scsc}Sub Text`
  );
  await f.setCollectionText(sc, [1, "Basic Text"], "Sub Text 2");
  await f.setCollectionText(sc, [1, scsc, 0, "Sub Text"], "Sub Sub Text 3");
  await f.setCollectionText(sc, [1, scsc, 1, "Sub Text"], "Sub Sub Text 4");
  await f.getCollection(sc, [1, scsc, 0]).getByText("Remove").click();
  await expect(f.getByLabel(sc)).toHaveText(
    `${sc}Basic Text${scsc}Sub Text RemoveSub Text RemoveSub Text RemoveBasic Text${scsc}Sub Text RemoveSub Text RemoveBasic Text${scsc}Sub Text`
  );
  //
  // subCollectionPopulated
  //
  const scp = "Required Sub Collection with all fields";
  const scpsc = "Sub Collection";

  await expect(f.getByLabel(scp)).toHaveText(
    `${scp}${scp} is a required fieldParent TitleParent ColorNo SelectionParent BlueParent RedParent GreenParent ImagePNG or JPEG, up to 4.3MBParent Images (4 remaining)PNG or JPEG, up to 4.3MB${scpsc}Sub TitleSub ColorNo SelectionSub BlueSub RedSub GreenSub ImagePNG or JPEG, up to 4.3MBSub Images (4 remaining)PNG or JPEG, up to 4.3MB`
  );
  await f.setText("Parent Title", "title of parent");
  // once this is edited, the required image field error will appear
  await expect(f.getByLabel(scp)).toHaveText(
    `${scp}Info hereParent TitleParent ColorNo SelectionParent BlueParent RedParent GreenParent ImagePNG or JPEG, up to 4.3MBParent Images (4 remaining)PNG or JPEG, up to 4.3MBParent Images is a required field${scpsc}${scpsc} is a required fieldSub TitleSub ColorNo SelectionSub BlueSub RedSub GreenSub ImagePNG or JPEG, up to 4.3MBSub Images (4 remaining)PNG or JPEG, up to 4.3MB RemoveAdd Parent`
  );
  await f.clickButton("Parent Color", "Parent Red");
  await f.uploadAndCrop("Parent Image", "kitten.jpg");
  await f.uploadAndCrop(
    "Parent Images (4 remaining)",
    "dice.png",
    "Some cool dice"
  );
  await f.uploadAndCrop(
    "Parent Images (3 remaining)",
    "kitten.jpg",
    "A Kitten"
  );
  await expect(f.getByLabel(scp)).toHaveText(
    `${scp}Info hereParent TitleParent ColorNo SelectionParent BlueParent RedParent GreenParent Image Remove Remove RemoveParent Images (2 remaining)PNG or JPEG, up to 4MB${scpsc}${scpsc} is a required fieldSub TitleSub ColorNo SelectionSub BlueSub RedSub GreenSub ImagePNG or JPEG, up to 4.3MBSub Images (4 remaining)PNG or JPEG, up to 4.3MB RemoveAdd Parent`
  );
  // now do the same for sub
  await f.setText("Sub Title", "title of sub");
  // the sub validation should appear
  await expect(f.getByLabel(scp)).toHaveText(
    `${scp}Info hereParent TitleParent ColorNo SelectionParent BlueParent RedParent GreenParent Image Remove Remove RemoveParent Images (2 remaining)PNG or JPEG, up to 4MB${scpsc}Sub TitleSub ColorNo SelectionSub BlueSub RedSub GreenSub ImagePNG or JPEG, up to 4.3MBSub Images (4 remaining)PNG or JPEG, up to 4.3MBSub Images is a required field RemoveAdd Sub RemoveAdd Parent`
  );
  await f.clickButton("Sub Color", "Sub Green");
  await f.uploadAndCrop("Sub Image", "dice.png");
  await f.uploadAndCrop("Sub Images (4 remaining)", "kitten.jpg", "Sub Kitten");
  await f.uploadAndCrop("Sub Images (3 remaining)", "dice.png", "Sub dice");
  await expect(f.getByLabel(scp)).toHaveText(
    `${scp}Info hereParent TitleParent ColorNo SelectionParent BlueParent RedParent GreenParent Image Remove Remove RemoveParent Images (2 remaining)PNG or JPEG, up to 4MB${scpsc}Sub TitleSub ColorNo SelectionSub BlueSub RedSub GreenSub Image Remove Remove RemoveSub Images (2 remaining)PNG or JPEG, up to 4MB RemoveAdd Sub RemoveAdd Parent`
  );

  expect(await f.submit()).toMatchObject({
    req: {
      collectionBasic: [
        {
          text: "Hello World Again",
        },
      ],
      collectionWithButton: [
        {
          text: "Hello World 2",
        },
        {
          text: "Hello World 3",
        },
      ],
      collectionWithLimit: [
        {
          text: "Uno",
        },
        {
          text: "Dos",
        },
        {
          text: "Tres",
        },
      ],
      collectionWithLimitButton: [
        {
          text: "One",
        },
        {
          text: "Three",
        },
      ],
      subCollection: [
        {
          subCollection: [
            {
              text: "Sub Sub Text 1",
            },
            {
              text: "Sub Sub Text 2",
            },
          ],
          text: "Sub Text 1",
        },
        {
          subCollection: [
            {
              text: "Sub Sub Text 4",
            },
          ],
          text: "Sub Text 2",
        },
      ],
      subCollectionPopulated: [
        {
          choice: "red",
          image: {
            data: "data:image/jpeg;base64,[vM7xIELqet]",
            type: "jpeg",
          },
          images: [
            {
              alt: "Some cool dice",
              data: "data:image/png;base64,[KncJzlfHSB]",
              type: "png",
            },
            {
              alt: "A Kitten",
              data: "data:image/jpeg;base64,[vM7xIELqet]",
              type: "jpeg",
            },
          ],
          subCollection: [
            {
              choice: "green",
              image: {
                data: "data:image/png;base64,[KncJzlfHSB]",
                type: "png",
              },
              images: [
                {
                  alt: "Sub Kitten",
                  data: "data:image/jpeg;base64,[vM7xIELqet]",
                  type: "jpeg",
                },
                {
                  alt: "Sub dice",
                  data: "data:image/png;base64,[KncJzlfHSB]",
                  type: "png",
                },
              ],
              text: "title of sub",
            },
          ],
          text: "title of parent",
        },
      ],
    },
    res: {
      commit: {
        changes: [
          {
            files: {
              "1-image.jpeg": "blob,[XjjDgGJlB7]",
              "2-images-0.png": "blob,[NMmsnTn0xi]",
              "3-images-1.jpeg": "blob,[XjjDgGJlB7]",
              "4-image.png": "blob,[NMmsnTn0xi]",
              "5-images-0.jpeg": "blob,[XjjDgGJlB7]",
              "6-images-1.png": "blob,[NMmsnTn0xi]",
              "test.yaml": `collectionBasic:
  - text: Hello World Again
collectionWithButton:
  - text: Hello World 2
  - text: Hello World 3
collectionWithLimit:
  - text: Uno
  - text: Dos
  - text: Tres
collectionWithLimitButton:
  - text: One
  - text: Three
subCollection:
  - text: Sub Text 1
    subCollection:
      - text: Sub Sub Text 1
      - text: Sub Sub Text 2
  - text: Sub Text 2
    subCollection:
      - text: Sub Sub Text 4
subCollectionPopulated:
  - text: title of parent
    choice: red
    image:
      data: "[image data]"
      type: jpeg
    images:
      - data: "[image data]"
        type: png
        alt: Some cool dice
      - data: "[image data]"
        type: jpeg
        alt: A Kitten
    subCollection:
      - text: title of sub
        choice: green
        image:
          data: "[image data]"
          type: png
        images:
          - data: "[image data]"
            type: jpeg
            alt: Sub Kitten
          - data: "[image data]"
            type: png
            alt: Sub dice
`,
            },
          },
        ],
      },
      pr: {
        body: `This PR adds a new Collection:

## Basic Collection
1 item(s)

## Required Collection with button
2 item(s)

## Collection with limit and min
3 item(s)

## Collection with button, required limit and min
2 item(s)

## Sub Collection Basic
2 item(s)

## Required Sub Collection with all fields
1 item(s)${f.FOOTER}`,
      },
    },
  });
});
