import { Octokit } from "@octokit/rest";
import Mocktokit from "@/../test/mocks/mocktokit";

let exported = Octokit;

if (process.env.NEXT_PUBLIC_TESTING === "E2E") {
  // console.log("🤡 Loaded Mocktokit");
  // @ts-ignore
  exported = Mocktokit;
}

export default exported;
