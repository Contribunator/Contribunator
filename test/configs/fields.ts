import contribution from "@/lib/contribution";
import { ContributionOptions, Fields } from "@/types";
import { BiCheck } from "react-icons/bi";
import { FaBook, FaGithub, FaLink } from "react-icons/fa";

function fieldTest(title: string, fields: Fields) {
  const fieldTestConfig: ContributionOptions = {
    title,
    icon: BiCheck,
    color: "lime",
    description: "Field Test",
    commit: async ({ fields }) => ({
      yaml: {
        "test.yaml": fields,
      },
    }),
    form: {
      fields,
    },
  };
  return contribution(fieldTestConfig);
}

// common
/*
  validation?: ValidationTypes;
  visible?: (p: VisibleProps) => boolean;
*/

// validation
// TODO only enable for specific types?
/*
  // common
  required?: string | boolean;
  yup?: Schema<any>;
  // lengthy items
  min?: number;
  max?: number;
  // text only
  url?: string | boolean;
  email?: string | boolean;
  matches?: RegexValidation;
*/

// Text
/*
  title?: string;
  prefix?: string;
  name: string;
  type?: string; // e.g. date, time, datetime-local
  info?: string;
  infoLink?: string;
  placeholder?: string;
  transform?: (value: string) => string;
  iframe?: (props: IframeProps) => string | null;
  suggestions?: Suggestions;
  tags?: string[];
  clear?: boolean;
  as?: "input" | "textarea";
  input?:
*/

export const text = fieldTest("Text", {
  textBasic: {
    type: "text",
    title: "Basic Text",
  },
  textRequired: {
    type: "text",
    title: "Required Text",
    validation: {
      required: true,
    },
  },
  textEmail: {
    type: "text",
    title: "Email Text",
    validation: {
      email: true,
    },
  },
  textUrl: {
    type: "text",
    title: "URL Text",
    validation: {
      url: true,
    },
  },
  textRegex: {
    type: "text",
    title: "Regex Text",
    validation: {
      matches: {
        message: "Must match 'hello' or 'world'",
        regex: /hello|world/,
      },
    },
  },
  textTransform: {
    type: "text",
    title: "Transform Text",
    transform: (value) => value.toUpperCase(),
  },
  textDate: {
    type: "text",
    title: "Date Text",
    input: "date",
  },
  textarea: {
    type: "text",
    title: "Textarea",
    as: "textarea",
  },
  textUI: {
    type: "text",
    title: "Text with all UI options",
    prefix: "Prefix",
    clear: true,
    info: "Info here",
    infoLink: "https://example.com",
    placeholder: "Placeholder",
    iframe: ({ field }) => field.value,
    suggestions: [
      {
        hasNo: "https://",
        message: "Try entering a URL",
      },
      {
        hasNo: "hello",
        message: "Say Hello!",
      },
      {
        has: "hello",
        message: "Don't say Hello!",
      },
    ],
    tags: ["tag1", "tag2"],
  },
});

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
          shark: {
            title: "Shark",
          },
          koi: {
            title: "Koi",
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

export const choice = fieldTest("Choice", {
  choiceDropdown: {
    type: "choice",
    title: "Choice Dropdown",
    options: flatOptions,
  },
  choiceDropdownUnset: {
    type: "choice",
    title: "Choice Dropdown with Unset",
    unset: "I don't like programming",
    options: flatOptions,
  },
  choiceDropdownUnsetSubs: {
    type: "choice",
    title: "Choice Dropdown with Unset and Subcategories",
    unset: "Unset Field",
    options: categories,
  },
  choiceDropdownMultiple: {
    type: "choice",
    multiple: true,
    title: "Multiple Choice Dropdown",
    options: flatOptions,
  },
  choiceButtons: {
    type: "choice",
    as: "buttons",
    title: "Choice Buttons",
    options: flatOptions,
  },
  icon: {
    title: "Choice Buttons (Icons)",
    type: "choice",
    as: "buttons",
    unset: "No Icon",
    options: {
      link: { icon: FaLink },
      book: { icon: FaBook },
      github: { icon: FaGithub },
    },
  },
  choiceButtonsUnset: {
    type: "choice",
    as: "buttons",
    title: "Choice Buttons with Unset",
    unset: "Unset Field",
    options: flatOptions,
  },
  choiceButtonsUnsetSubs: {
    type: "choice",
    as: "buttons",
    title: "Choice Buttons with Unset and Subcategories",
    unset: "Unset Field",
    options: categories,
  },
  choiceButtonsMultiple: {
    type: "choice",
    as: "buttons",
    multiple: true,
    title: "Multiple Choice Buttons",
    options: flatOptions,
  },
});

export const info = fieldTest("Info", {
  info: {
    type: "info",
    title: "This is an info field",
  },
});

// Image
/*
  fileSizeLimit?: number;
  title?: string;
  name: string;
  alt?: boolean | string;
  info?: string;
  aspectRatio?: number;
*/

// Images
/*
  limit?: number;
  totalFileSizeLimit?: number;
*/

// Info
/*
  title: string;
*/

// Collection
/*
  name: string;
  title: string;
  limit?: number;
  showAtLeast?: number;
  fields: Fields;
  info?: string;
  infoLink?: string;
  addButton?: boolean | string;
*/
