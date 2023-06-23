import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "fields", contribution: "choice" });

test("choice field", async ({ f }) => {
  // choiceDropdown
  // choiceDropdownRequired
  // choiceDropdownUnset
  // choiceDropdownUnsetSubs
  // choiceDropdownMultiple
  // choiceButtons
  // choiceButtonsInline
  // choiceButtonsRequired
  // choiceButtonsIcons
  // choiceButtonsUnsetSubs
  // choiceButtonsUnsetSubsRequired
  // choiceButtonsMultiple
  // choiceButtonsMultipleRequiredMinMax
  // choiceButtonsMultipleSubs
  // expect(await f.submit()).toEqual({});
});
