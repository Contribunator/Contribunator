import contribution from "@/lib/contribution";
import { Fields, ContributionOptions } from "@/types";
import { FaSink } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";

import textFieldTest from "./text";
import choiceFieldTest from "./choice";
import imageFieldTest from "./image";
import collectionFieldTest from "./collection";

import { deepTrimImageData } from "test/fixtures/deepTrimImageData";

// common
/*
  validation?: ValidationTypes;
  visible?: (p: VisibleProps) => boolean;
*/

// validation
// TODO only enable for specific types?
/*
  // common
  yup?: Schema<any>;
*/

function fieldTest(props: any, passedFields: Fields) {
  const fieldTestConfig: ContributionOptions = {
    icon: BiCheck,
    color: "lime",
    description: "Field Test",
    ...props,
    load: async () => ({
      commit: async ({ data, images }) => {
        // throw new Error("not implemented");
        return {
          images,
          yaml: {
            "test.yaml": deepTrimImageData(data),
          },
        };
      },
      form: {
        fields: {
          ...passedFields,
        },
      },
    }),
  };
  return contribution(fieldTestConfig);
}

const fieldTests = {
  text: fieldTest({ title: "Text" }, textFieldTest),
  choice: fieldTest({ title: "Choice" }, choiceFieldTest),
  collection: fieldTest({ title: "Collection" }, collectionFieldTest),
  image: fieldTest({ title: "Image" }, imageFieldTest),
};

export const combined = fieldTest(
  {
    title: "Kitchen Sink",
    description: "A demo of all the available field configurations",
    color: "pink",
    icon: FaSink,
  },
  {
    ...textFieldTest,
    ...choiceFieldTest,
    ...imageFieldTest,
    ...collectionFieldTest,
  }
);

export default fieldTests;
