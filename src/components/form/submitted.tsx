import { Route } from "next";
import Link from "next/link";
import { HiOutlineEmojiHappy, HiExternalLink } from "react-icons/hi";
import { CreatePullRequestOutputs } from "@/lib/createPullRequest";

export default function Submitted({ pr }: { pr: CreatePullRequestOutputs }) {
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
    </div>
  );
}
