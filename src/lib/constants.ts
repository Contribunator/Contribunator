import type { Config } from "@/types";

export const COMMIT_REPLACE_SHA = "[COMMIT_SHA]";

export const DEFAULTS: Config = {
  authorization: ["github"],
  title: "Contribunator",
  description:
    "Effortlessly contribute to GitHub! No coding or GitHub experience needed. Simply fill out a form, submit, and you're done. Contributing has never been easier!",
  owner: "Contribunator",
  branchPrefix: "c11r/",
  // base: "main",
  prPostfix:
    "\n\n---\n*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*",
  repos: {},
};
