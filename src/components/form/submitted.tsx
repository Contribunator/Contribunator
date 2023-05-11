import { Route } from "next";
import Link from "next/link";
import { HiOutlineEmojiHappy, HiExternalLink } from "react-icons/hi";

export default function Submitted({ prUrl }: { prUrl: string }) {
  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-center">
        <HiOutlineEmojiHappy className="text-6xl" />
      </div>
      <div>
        <h3 className="title">Congrats, your Pull Request was created!</h3>
        <Link
          className="link-hover text-xs"
          href={prUrl as Route}
          target="_blank"
        >
          {prUrl}
        </Link>
      </div>
      <div>
        <Link
          href={prUrl as Route}
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
