import contribution from "@/lib/contribution";
import { Fields, ContributionOptions } from "@/types";
import { FaSink } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import textFieldTest from "./text";
import choiceFieldTest from "./choice";
import imageFieldTest from "./image";
import collectionFieldTest from "./collection";

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

// TODO move this logic to the commit step
// automatically detect and convert images

const deepFormatImageData = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepFormatImageData);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "string" && value.startsWith("data:image")) {
        return [key, "[image data]"];
      }
      return [key, deepFormatImageData(value)];
    })
  );
};

function fieldTest(props: any, passedFields: Fields) {
  const fieldTestConfig: ContributionOptions = {
    icon: BiCheck,
    color: "lime",
    description: "Field Test",
    ...props,
    load: async () => ({
      commit: async ({ fields }) => {
        // convert the images to a yaml file
        const images: any = {};
        const file: any = deepFormatImageData(fields);
        let imagesIndex = 0;
        const setImage = (name: string, { data, type }: any) => {
          imagesIndex += 1;
          const fileName = `${imagesIndex}-${name}.${type}`;
          images[fileName] = data;
        };
        const getImagesDeep = (obj: any, parent?: string) => {
          Object.entries(obj).forEach(([name, field]) => {
            if (!name.startsWith("image")) {
              if (typeof field === "object") {
                getImagesDeep(field, name);
              }
              return;
            }
            if (Array.isArray(field)) {
              Object.entries(field).forEach(([index, { data, alt, type }]) => {
                setImage(`${name}-${index}`, { data, alt, type });
              });
            } else if (typeof field === "object") {
              setImage(name, field);
            }
          });
        };
        getImagesDeep(fields);
        return {
          images,
          yaml: {
            "test.yaml": file,
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
