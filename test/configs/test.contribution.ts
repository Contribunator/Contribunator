import contribution from "@/lib/contribution";
import { ContributionLoaded } from "@/types";

export const testContribution: ContributionLoaded = {
  commit: async ({ data, fetched, files }) => ({
    files: {
      "test.md": JSON.stringify(data),
    },
    yaml: {
      "test.yaml": {
        data,
        fetched,
        yaml: files.testYaml.parsed,
        md: files.testMd.content,
      },
    },
    json: {
      "test.json": {
        data,
        fetched,
        json: files.testJson.parsed,
        md: files.testMd.content,
      },
    },
  }),
  useFiles: () => ({ testMd: "_E2E_/test.md" }),
  useFilesOnServer: {
    testYaml: "_E2E_/test.yaml",
    testJson: "_E2E_/test.json",
  },
  useDataOnServer: async (props) => {
    return { test: "data" };
  },
  form: {
    fields: {
      text: {
        type: "text",
        title: "Text",
        validation: { required: true },
      },
    },
  },
};

export default contribution(testContribution);
