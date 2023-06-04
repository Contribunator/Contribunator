import { Contribution, TailwindColor } from "@/lib/config";

import { ChoiceInput } from "@/components/form/choiceInput";
import { TextInput } from "@/components/form/textInput";
import { ImageInput } from "@/components/form/imageInput";
import { ImagesInput } from "@/components/form/imagesInput";

import generateSchema from "./generateSchema";
import { TransformInputs, TransformOutputs } from "@/lib/pullRequestHandler";
import getImageType from "@/lib/getImageType";

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

type CommitOutput = Omit<TransformOutputs, "title" | "message">;

export type GenericConfig = Contribution & {
  type: string;
  options: {
    commit: (arg: TransformInputs) => Promise<CommitOutput>;
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
  prMetadata: (values: any) => ({
    title: "Add Generic Contribution",
    message: "This PR adds a Generic Contribution",
  }),
};

export default function genericConfig(
  opts: GenericOptions = {}
): GenericConfig {
  // throw if invalid options
  // throw if using reserved names e.g. `title` and `message`
  // TODO option for collections
  const config: Omit<GenericConfig, "initialValues" | "schema"> = {
    ...defaultConfig,
    ...opts,
    type: "generic",
    // useFiles: {
    //   folder: "test",
    //   json: "test/hello.json",
    //   notFound: "test.json",
    //   readme: "README.md",
    // },
    useFilesOnServer: {
      hello: "test/hello.json",
    },
    options: {
      commit: async ({
        body,
        timestamp,
      }: TransformInputs): Promise<CommitOutput> => {
        // TODO automatically parse JSON from files
        // TODO autoamtically infer image types
        const commit = {
          files: {
            "hello.txt": `Hello, world! ${timestamp}`,
          },
          ...(body.image && {
            images: { [`cat.${getImageType(body.image)}`]: body.image },
          }),
        };
        return commit;
      },
      fields: {
        // TODO collections
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
          // TODO allow this to consume useFiles
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
