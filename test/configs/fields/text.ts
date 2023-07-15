import { Fields } from "@/types";

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

const textFieldTest: Fields = {
  infoText: {
    type: "info",
    title: "Text Fields",
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
  textUI: {
    type: "text",
    title: "Text with all UI options",
    prefix: "Prefix",
    clear: true,
    info: "Info here",
    infoLink: "https://example.com",
    placeholder: "Placeholder",
    iframe: ({ field }) => field.value as string,
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
};

export default textFieldTest;
