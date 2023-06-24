import { Fields } from "@/types";
import { FaLink, FaBook, FaGithub } from "react-icons/fa";

const flatOptions = {
  javascript: {
    title: "Javascript",
  },
  rust: {
    title: "Rust",
  },
  python: {
    title: "Python",
  },
  ruby: {
    title: "Ruby",
  },
};

const categories = {
  animals: {
    title: "Animals",
    options: {
      cat: {
        title: "Cat",
      },
      dog: {
        title: "Dog",
        options: {
          pitbull: {
            title: "Pit Bull",
          },
          poodle: {
            title: "Poodle",
          },
        },
      },
      fish: {
        title: "Fish",
        options: {
          goldfish: {
            title: "Goldfish",
          },
          tuna: {
            title: "Tuna",
          },
          cod: {
            title: "Cod",
          },
        },
      },
    },
  },
  food: {
    title: "Food",
  },
  music: {
    title: "Music",
  },
};

// TODO always show unset if not requried

// Choice
/*
  name: string;
  title?: string;
  unset?: string;
  info?: string;
  multiple?: boolean;
  options: NestedChoiceOptions;
  as?: "dropdown" | "buttons";
*/

const choiceFieldTest: Fields = {
  choiceDropdown: {
    type: "choice",
    title: "Dropdown",
    options: flatOptions,
  },
  choiceDropdownRequired: {
    type: "choice",
    title: "Dropdown Required",
    options: flatOptions,
    validation: { required: true },
  },
  choiceDropdownUnset: {
    type: "choice",
    title: "Dropdown Custom Unset",
    unset: "I don't like programming",
    options: flatOptions,
  },
  choiceDropdownSubs: {
    type: "choice",
    title: "Dropdown Subs",
    options: categories,
  },
  choiceDropdownMultiple: {
    type: "choice",
    multiple: true,
    title: "Multi Dropdown",
    options: categories,
  },
  choiceButtons: {
    type: "choice",
    as: "buttons",
    title: "Buttons",
    options: flatOptions,
  },
  choiceButtonsInline: {
    type: "choice",
    as: "buttons-inline",
    title: "Buttons Inline",
    options: flatOptions,
  },
  choiceButtonsRequired: {
    type: "choice",
    as: "buttons",
    title: "Buttons Required",
    options: flatOptions,
    validation: { required: true },
  },
  choiceButtonsIcons: {
    title: "Icon Buttons",
    type: "choice",
    as: "buttons",
    unset: "No Icon",
    options: {
      link: { icon: FaLink },
      book: { icon: FaBook },
      github: { icon: FaGithub },
    },
  },
  choiceButtonsUnsetSubs: {
    type: "choice",
    as: "buttons",
    title: "Sub Buttons",
    options: categories,
  },
  choiceButtonsUnsetSubsRequired: {
    type: "choice",
    as: "buttons",
    title: "Required Sub Buttons",
    options: categories,
    validation: { required: true },
  },
  choiceButtonsMultiple: {
    type: "choice",
    as: "buttons",
    multiple: true,
    title: "Multi Buttons",
    options: flatOptions,
  },
  choiceButtonsMultipleRequiredMinMax: {
    type: "choice",
    as: "buttons",
    multiple: true,
    title: "Multi Buttons Required",
    options: flatOptions,
    validation: { required: true, min: 2, max: 3 },
  },
  choiceButtonsMultipleSubs: {
    type: "choice",
    as: "buttons",
    multiple: true,
    title: "Multi Sub Buttons",
    options: categories,
  },
};

export default choiceFieldTest;
