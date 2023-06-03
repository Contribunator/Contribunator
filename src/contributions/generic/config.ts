import { Contribution, TailwindColor } from "@/lib/config";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";

import generateSchema from "./generateSchema";

type ValidationOptions = { required?: string; min?: number; max?: number };

type FieldType = "text" | "choice" | "image" | "images";

export type TextField = Omit<TextInput, "name">;
export type ChoiceField = Omit<ChoiceInput, "name">;
export type ImageField = Omit<ImageInput, "name">;
export type ImagesField = Omit<ImagesInput, "name">;

// TODO a better way to do this?
type Field = { type: FieldType; validation?: ValidationOptions } & (
  | TextField
  | ChoiceField
  | ImageField
  | ImagesField
);

export type GenericConfig = Contribution & {
  type: string;
  options: {
    fields: {
      [key: string]: Field;
    };
  };
};

type GenericOptions = Omit<Partial<GenericConfig>, "type">;

const defaultConfig = {
  title: "Generic Contribution",
  description: "This is a generic contribution",
  color: "red" as TailwindColor,
  metadata: {
    title: (values: any) => "Add Generic Contribution",
    message: (values: any) => "This PR adds a Generic Contribution",
  },
};

export default function genericConfig(
  opts: GenericOptions = {}
): GenericConfig {
  // throw if invalid options
  // throw if using reserved names e.g. `title` and `message`
  // TODO option for collections
  const config = {
    ...defaultConfig,
    ...opts,
    type: "generic",
    // useFiles: {
    //   folder: "test",
    //   json: "test/hello.json",
    //   notFound: "test.json",
    //   readme: "README.md",
    // },
    options: {
      fields: {
        name: {
          type: "text" as FieldType,
          title: "Enter your name",
          placeholder: "This is my name",
        },
        pets: {
          type: "text" as FieldType,
          as: "textarea",
          title: "Do you have pets?",
          placeholder: "Enter your pets here",
          validation: {
            required: "Must tell me your pet!",
          },
        },
        color: {
          type: "choice" as FieldType,
          component: "buttons",
          title: "Choose a color",
          validation: {
            required: "You must choose an color!",
          },
          options: {
            red: {
              text: "Red",
            },
            blue: {
              text: "Blue",
            },
            green: {
              text: "Green",
            },
          },
        },
        vehicle: {
          type: "choice" as FieldType,
          title: "Choose a Vehicle",
          options: {
            car: {
              text: "Car",
            },
            truck: {
              text: "Truck",
            },
            bike: {
              text: "Bike",
            },
            hovercraft: {
              text: "Hovercraft",
            },
          },
        },
        image: {
          type: "image" as FieldType,
          aspectRatio: 1,
        },
        images: {
          type: "images" as FieldType,
          limit: 2,
          totalFileSizeLimit: 1,
        },
      },
    },
  };

  return { ...config, ...generateSchema(config) };
}
