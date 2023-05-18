import UserInfo from "@/components/header/userInfo";
import config from "@/util/config";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";

type Props = {
  children: React.ReactNode;
};

export async function generateStaticParams() {
  return Object.keys(config.repos).map((repo) => ({
    repo,
  }));
}

export default async function ContributionLayout({ children }: Props) {
  // TODO return empty page if the type isn't supported for this repo
  // Trigger notFound() if the type isn't supported for this repo

  return (
    <div className="min-h-screen py-6 space-y-6">
      <div className="flex justify-center">
        {/* @ts-expect-error Server Component */}
        <UserInfo />
      </div>
      <div className="divider"></div>
      {children}
      <Link className="btn gap-2" href="/contribute">
        Contributions List
        <BiListPlus className="h-5 w-5" />
      </Link>
    </div>
  );
}
