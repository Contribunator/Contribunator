import Link from "next/link";
import { Route } from "next";
import Image from "next/image";

const buildSha = process.env.VERCEL_GIT_COMMIT_SHA;
const githubSource =
  process.env.NEXT_PUBLIC_GITHUB_SOURCE ||
  "https://github.com/Contribunator/Contribunator";

export const githubLink = buildSha
  ? `${githubSource}/commit/${buildSha}`
  : githubSource;

const vercelTeam = process.env.NEXT_PUBLIC_VERCEL_OSS_TEAM;
export const vercelLink =
  vercelTeam && `https://vercel.com?utm_source=${vercelTeam}&utm_campaign=oss`;

export default function Footer() {
  return (
    <div className="flex flex-col space-y-6 pt-10">
      <Link
        href={githubLink as Route}
        target="_blank"
        className="mt-10 text-xs font-mono text-base-300"
      >
        Contribunator@
        {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 6) || "local"}
      </Link>
      {vercelLink && (
        <Link
          href={vercelLink as Route}
          target="_blank"
          className="opacity-40 hover:opacity-100"
        >
          <Image
            className="rounded-md border-black border"
            src="/powered-by-vercel-white.svg" // change to black for dark mode
            alt="Powered by Vercel"
            width="212"
            height="44"
          />
        </Link>
      )}
    </div>
  );
}
