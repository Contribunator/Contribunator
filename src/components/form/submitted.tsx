import { Route } from "next";
import Link from "next/link";
import { HiOutlineEmojiHappy, HiExternalLink } from "react-icons/hi";
import { CreatePullRequestOutputs } from "@/lib/createPullRequest";
import React from "react";

function TestData({
  pr: { body, title, ...pr },
  commit: { branch, changes, ...commit },
}: any) {
  return (
    <>
      {/* <div>TEST PREVIEW</div> */}
      <pre className="bg-base-100 p-4 font-mono text-left text-sm whitespace-pre-wrap space-y-4 flex flex-col overflow-hidden rounded-md">
        <div>
          <div className="font-bold">Commit Message: </div>
          {title}
        </div>
        <div>
          <div className="font-bold">Branch: </div>
          {branch}
        </div>
        <div>
          <div className="font-bold">PR Message:</div>
          {body.split("\n").map((t: string) => (
            <span key={t}>
              {t}
              <br />
            </span>
          ))}
        </div>
        {Object.entries(changes[0].files).map(([file, content]: any) => (
          <div key={file}>
            <div className="font-bold">{file}</div>
            {content.split("\n").map((t: string) => (
              <>
                {t}
                <br />
              </>
            ))}
          </div>
        ))}
      </pre>
    </>
  );
}

export default function Submitted({
  pr: { pr, test },
}: {
  pr: { pr: CreatePullRequestOutputs; test?: any };
}) {
  return (
    <div className="flex flex-col py-6 space-y-6">
      <div className="flex justify-center">
        <HiOutlineEmojiHappy className="text-6xl" />
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
          className="btn btn-success btn-lg gap-2"
        >
          View PR on Github
          <HiExternalLink />
        </Link>
      </div>
      {test && <TestData {...test} />}
    </div>
  );
}
