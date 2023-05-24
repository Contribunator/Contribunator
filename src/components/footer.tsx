import Link from "next/link";
import { Route } from "next";
import Image from "next/image";

const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const githubSource =
  process.env.NEXT_PUBLIC_GITHUB_SOURCE ||
  "https://github.com/Contribunator/Contribunator";
const githubLink = (
  sha ? `${githubSource}/commit/${sha}` : githubSource
) as Route;

const teamName = process.env.NEXT_PUBLIC_VERCEL_OSS_TEAM;
const vercelLink =
  `https://vercel.com?utm_source=?utm_source=${teamName}&utm_campaign=oss` as Route;

export default function Footer() {
  return (
    <div className="flex flex-col space-y-6 pt-10">
      <Link
        href={githubLink}
        target="_blank"
        className="mt-10 text-xs font-mono text-base-300"
      >
        Contribunator@
        {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 6) || "local"}
      </Link>
      {vercelLink && (
        <Link
          href={vercelLink}
          target="_blank"
          className="opacity-40 hover:opacity-100"
        >
          <Image
            className="rounded-md border-black border"
            src="/powered-by-vercel.svg"
            alt="Powered by Vercel"
            width="212"
            height="44"
          />
        </Link>
      )}
    </div>
  );
}
