import Link from "next/link";
import { Route } from "next";
import { HiExternalLink } from "react-icons/hi";
import { BsEmojiSunglasses } from "react-icons/bs";

import type { PrMetaResponse, E2ETestResponse } from "@/types";

import SubmittedTestData from "./submittedTestData";

export default function Submitted({
  pr,
  test,
}: {
  pr: PrMetaResponse;
  test?: E2ETestResponse;
}) {
  return (
    <div className="flex flex-col py-6 space-y-6">
      <div className="flex justify-center">
        <BsEmojiSunglasses className="text-6xl" />
      </div>
      <h3 className="title">Congrats, your Pull Request was created!</h3>
      <Link className="link-hover" href={pr.url as Route} target="_blank">
        <div className="font-bold">
          <span className="text-neutral-500">#{pr.number} </span>
          {pr.title}
        </div>
        <div className="text-xs">{pr.url}</div>
      </Link>
      <div>
        <Link
          href={pr.url as Route}
          target="_blank"
          className="btn btn-success btn-lg"
        >
          View PR on Github
          <HiExternalLink />
        </Link>
      </div>
      {/* TODO: Create Another Contribution */}
      {test && <SubmittedTestData {...test} />}
    </div>
  );
}
