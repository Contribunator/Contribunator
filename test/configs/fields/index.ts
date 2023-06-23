import contribution from "@/lib/contribution";
import { Fields, ContributionOptions } from "@/types";
import { BiCheck } from "react-icons/bi";
import textFieldTest from "./text";
import choiceFieldTest from "./choice";

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

function fieldTest(props: any, fields: Fields) {
  const fieldTestConfig: ContributionOptions = {
    ...props,
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

const fieldTests = {
  text: fieldTest({ title: "Text" }, textFieldTest),
  choice: fieldTest({ title: "Choice" }, choiceFieldTest),
  info: fieldTest(
    { title: "Info" },
    {
      info: {
        type: "info",
        title: "This is an info field",
      },
    }
  ),
};

export default fieldTests;
