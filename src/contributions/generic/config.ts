import { Contribution, TailwindColor } from "@/lib/config";

type File = {
  fileName: string;
  content: string;
  exists: boolean;
};

type Transform = {
  body: any;
  files: File[];
};

type Transformed = {
  [key: string]: string;
};

export default function genericConfig(): Contribution {
  return {
    type: "generic",
    title: "Generic Contribution",
    description: "This is a generic contribution",
    color: "red" as TailwindColor,
    options: {
      useFiles: {
        folder: "test",
        json: "test/hello.json",
        notFound: "test.json",
        readme: "README.md",
      },

      commit: ({ body: { name, link }, files }: Transform): Transformed => {
        // if the file doesn't exist, let's create it
        // should return an object similar to createMultipleFiles
        console.log(files);
        return {
          [`${name}.txt`]: `Hello, my link is ${link}`,
        };
      },
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
