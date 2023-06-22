import contribution from "@/lib/contribution";
import { ContributionOptions, Fields } from "@/types";

function fieldTest(title: string, fields: Fields) {
  const fieldTestConfig: ContributionOptions = {
    title,
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
  textFull: {
    type: "text",
    title: "Text With Full Options",
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
});

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
