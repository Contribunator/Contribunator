import { Contribution, TailwindColor } from "@/lib/config";

type GenericConfig = Contribution & {};
type GenericOptions = Omit<Partial<GenericConfig>, "type"> & { name?: string };

const defaultConfig = {
  type: "generic",
  title: "Generic Contribution",
  description: "This is a generic contribution",
  color: "red" as TailwindColor,
  schema: {},
  initialValues: {},
  metadata: {
    title: (values: any) => "Add Generic Contribution",
    message: (values: any) => "This PR adds a Generic Contribution",
  },
};

export default function genericConfig(
  opts: GenericOptions = {}
): GenericConfig {
  // TODO generate different schema, initialValues, meta based on config options

  // throw if invalid options
  // throw if using reserved names e.g. `title` and `message`

  // TODO option for collections

  return {
    ...defaultConfig,
    ...opts,
    useFiles: {
      folder: "test",
      json: "test/hello.json",
      notFound: "test.json",
      readme: "README.md",
    },
    options: {
      fields: {
        name: {
          type: "text",
        },
        link: {
          type: "link",
        },
      },
    },
  };
}
