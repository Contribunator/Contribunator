import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "_E2E_fields", contribution: "choice" });

test("choice fields", async ({ f }) => {
  // TODO move this into fixture
  async function expectText(field: string, text: string) {
    await expect(f.getByLabel(field)).toHaveText(text);
  }
  async function expectValue(field: string, value: string, type = "dropdown") {
    expect(await f.getValue(field, type)).toEqual(value);
  }
  async function expectButtonValue(field: string, value: string) {
    return expectValue(field, value, "buttons");
  }

  async function select(
    field: string,
    value: string | string[],
    type: string = "dropdown"
  ) {
    if (type === "buttons") {
      await f.clickButton(field, value);
    } else {
      await f.clickDropdownItem(field, value);
    }
    const expected = Array.isArray(value) ? value[value.length - 1] : value;
    return expectValue(field, expected, type);
  }
  async function selectButton(field: string, value: string | string[]) {
    return select(field, value, "buttons");
  }
  //
  // choiceDropdown
  //
  await expectValue("Dropdown", "No Selection");
  await select("Dropdown", "Rust");
  // can be deselected
  await select("Dropdown", "No Selection");
  // set again
  await select("Dropdown", "Javascript");
  //
  // choiceDropdownRequired
  //
  await f.cannotSubmit(["Dropdown Required is a required field"]);
  await select("Dropdown Required", "Rust");
  await expect(f.getByLabel("Dropdown Required")).not.toContainText(
    "No Selection"
  );
  //
  // choiceDropdownUnset
  //
  await expectValue("Dropdown Custom Unset", "I don't like programming");
  await select("Dropdown Custom Unset", "Rust");
  await select("Dropdown Custom Unset", "I don't like programming");
  await select("Dropdown Custom Unset", "Rust");
  //
  // choiceDropdownUnsetSubs
  //
  await expectValue("Dropdown Subs", "No Selection");
  await select("Dropdown Subs", ["Animals", "Dog", "Poodle"]);
  //
  // choiceDropdownMultiple
  //
  await f.clickDropdownItem("Multi Dropdown", ["Animals", "Dog", "Poodle"]);
  await f.clickDropdownItem("Multi Dropdown", ["Food"]);
  await expectValue("Multi Dropdown", "Poodle, Food");
  //
  // choiceButtons
  //
  // all buttons are vislbe
  await expectText("Buttons", "ButtonsNo SelectionJavascriptRustPythonRuby");
  // default seelction
  await expectButtonValue("Buttons", "No Selection");
  // can select
  await selectButton("Buttons", "Rust");
  // can unselect
  await selectButton("Buttons", "No Selection");
  // can select again
  await selectButton("Buttons", "Javascript");
  //
  // choiceButtonsInline
  //
  await expect(f.getByLabel("Buttons Inline")).toHaveText(
    "Buttons InlineNo SelectionJavascriptRustPythonRuby"
  );
  // default seelction
  await expectButtonValue("Buttons Inline", "No Selection");
  // can select
  await selectButton("Buttons Inline", "Rust");
  // can unselect
  await selectButton("Buttons Inline", "No Selection");
  // can select again
  await selectButton("Buttons Inline", "Javascript");
  //
  // choiceButtonsRequired
  //
  await expectText(
    "Buttons Required",
    "Buttons RequiredButtons Required is a required fieldJavascriptRustPythonRuby"
  );
  await selectButton("Buttons Required", "Rust");
  await expect(f.getByLabel("Buttons Required")).not.toContainText(
    "required field"
  );
  //
  // choiceButtonsIcons
  //
  await expectText("Icon Buttons", "Icon ButtonsNo Icon");
  const icons = f.getByLabel("Icon Buttons");
  expect(await icons.locator(".btn svg").count()).toEqual(3);
  // we test this later in the response
  await icons.locator(".btn").nth(2).click();
  //
  // choiceButtonsUnsetSubs
  //

  await expectText("Sub Buttons", "Sub ButtonsNo SelectionAnimalsFoodMusic");
  // category navgation works
  await f.clickButton("Sub Buttons", "Animals");
  await expectText(
    "Sub Buttons",
    "Sub ButtonsNo SelectionAnimalsFoodMusicCatDogFish"
  );
  await f.clickButton("Sub Buttons", "Fish");
  await expectText(
    "Sub Buttons",
    "Sub ButtonsNo SelectionAnimalsFoodMusicCatDogFishGoldfishTunaCod"
  );
  await f.clickButton("Sub Buttons", "Cod");
  await expectButtonValue("Sub Buttons", "Cod");
  // deselect works
  await selectButton("Sub Buttons", "No Selection");
  await expectText("Sub Buttons", "Sub ButtonsNo SelectionAnimalsFoodMusic");
  // reselect works
  await selectButton("Sub Buttons", ["Animals", "Dog", "Poodle"]);
  await expectText(
    "Sub Buttons",
    "Sub ButtonsNo SelectionAnimalsFoodMusicCatDogFishPit BullPoodle"
  );
  //
  // choiceButtonsUnsetSubsRequired
  //
  await expectText(
    "Required Sub Buttons",
    "Required Sub ButtonsRequired Sub Buttons is a required fieldAnimalsFoodMusic"
  );
  await selectButton("Required Sub Buttons", ["Animals", "Dog", "Poodle"]);
  await expect(f.getByLabel("Required Sub Buttons")).not.toContainText(
    "required field"
  );
  //
  // choiceButtonsMultiple
  //
  await expectText("Multi Buttons", "Multi ButtonsJavascriptRustPythonRuby");
  await f.clickButton("Multi Buttons", "Javascript");
  await f.clickButton("Multi Buttons", "Rust");
  await expectButtonValue("Multi Buttons", "Javascript, Rust");
  await f.clickButton("Multi Buttons", "Rust");
  await f.clickButton("Multi Buttons", "Python");
  await expectButtonValue("Multi Buttons", "Javascript, Python");

  //
  // choiceButtonsMultipleRequiredMinMax
  //
  await expectText(
    "Multi Buttons Required",
    "Multi Buttons RequiredMulti Buttons Required is a required fieldJavascriptRustPythonRuby"
  );
  await f.clickButton("Multi Buttons Required", "Javascript");
  await expect(f.getByLabel("Multi Buttons Required")).toContainText(
    "field must have at least 2 items"
  );
  await f.clickButton("Multi Buttons Required", "Rust");
  await f.clickButton("Multi Buttons Required", "Python");
  await f.clickButton("Multi Buttons Required", "Ruby");
  await expect(f.getByLabel("Multi Buttons Required")).toContainText(
    "field must have less than or equal to 3 items"
  );
  await f.clickButton("Multi Buttons Required", "Python");
  await expectButtonValue("Multi Buttons Required", "Javascript, Rust, Ruby");
  //
  // choiceButtonsMultipleSubs
  //
  await expectText(
    "Multi Sub Buttons",
    "Multi Sub ButtonsAnimalsCatDogPit BullPoodleFishGoldfishTunaCodFoodMusic"
  );
  await f.clickButton("Multi Sub Buttons", "Poodle");
  await f.clickButton("Multi Sub Buttons", "Music");
  await expectButtonValue("Multi Sub Buttons", "Poodle, Music");
  await f.clickButton("Multi Sub Buttons", "Cat");
  await f.clickButton("Multi Sub Buttons", "Poodle");
  await f.clickButton("Multi Sub Buttons", "Food");
  await expectButtonValue("Multi Sub Buttons", "Cat, Food, Music");

  expect(await f.submit()).toMatchObject({
    req: {
      choiceButtons: "javascript",
      choiceButtonsIcons: "book",
      choiceButtonsInline: "javascript",
      choiceButtonsMultiple: ["javascript", "python"],
      choiceButtonsMultipleRequiredMinMax: ["javascript", "rust", "ruby"],
      choiceButtonsMultipleSubs: ["music", "animals.cat", "food"],
      choiceButtonsRequired: "rust",
      choiceButtonsUnsetSubs: "animals.dog.poodle",
      choiceButtonsUnsetSubsRequired: "animals.dog.poodle",
      choiceDropdown: "javascript",
      choiceDropdownMultiple: ["animals.dog.poodle", "food"],
      choiceDropdownRequired: "rust",
      choiceDropdownSubs: "animals.dog.poodle",
      choiceDropdownUnset: "rust",
    },
    res: {
      commit: {
        changes: [
          {
            files: {
              "test.yaml": `choiceDropdown: javascript
choiceDropdownRequired: rust
choiceDropdownUnset: rust
choiceDropdownSubs: animals.dog.poodle
choiceDropdownMultiple:
  - animals.dog.poodle
  - food
choiceButtons: javascript
choiceButtonsInline: javascript
choiceButtonsRequired: rust
choiceButtonsIcons: book
choiceButtonsUnsetSubs: animals.dog.poodle
choiceButtonsUnsetSubsRequired: animals.dog.poodle
choiceButtonsMultiple:
  - javascript
  - python
choiceButtonsMultipleRequiredMinMax:
  - javascript
  - rust
  - ruby
choiceButtonsMultipleSubs:
  - music
  - animals.cat
  - food
`,
            },
          },
        ],
      },
      pr: {
        body: `This PR adds a new Choice:

## Dropdown
Javascript

## Dropdown Required
Rust

## Dropdown Custom Unset
Rust

## Dropdown Subs
Poodle

## Multi Dropdown
Poodle, Food

## Buttons
Javascript

## Buttons Inline
Javascript

## Buttons Required
Rust

## Icon Buttons
book

## Sub Buttons
Poodle

## Required Sub Buttons
Poodle

## Multi Buttons
Javascript, Python

## Multi Buttons Required
Javascript, Rust, Ruby

## Multi Sub Buttons
Music, Cat, Food${f.FOOTER}`,
      },
    },
  });
});
