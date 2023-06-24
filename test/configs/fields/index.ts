import contribution from "@/lib/contribution";
import { Fields, ContributionOptions, Commit } from "@/types";
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

function fieldTest(props: any, fields: Fields, commit?: Commit) {
  const fieldTestConfig: ContributionOptions = {
    ...props,
    icon: BiCheck,
    color: "lime",
    description: "Field Test",
    commit: async ({ fields }) => {
      // convert the images to a yaml file
      const images: any = {};
      const file: any = {};
      const setImage = (name: string, { data, alt, type }: any) => {
        const fileName = `${name}.${type}`;
        images[fileName] = data;
        file[fileName] = { alt, type };
      };
      Object.entries(fields).forEach(([name, field]) => {
        if (!name.startsWith("image")) {
          file[name] = field;
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
      return {
        images,
        yaml: {
          "test.yaml": file,
        },
      };
    },
    form: {
      fields,
    },
  };
  return contribution(fieldTestConfig);
}

const fieldTests = {
  text: fieldTest({ title: "Text" }, textFieldTest),
  choice: fieldTest({ title: "Choice" }, choiceFieldTest),
  collection: fieldTest({ title: "Collection" }, collectionFieldTest),
  image: fieldTest({ title: "Image" }, imageFieldTest),
};

export default fieldTests;
