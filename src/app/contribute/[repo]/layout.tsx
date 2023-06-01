import UserInfo from "@/components/userInfo";
import config from "@/util/config";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";

type Props = {
  children: React.ReactNode;
};

export const generateStaticParams =
  process.env.NODE_ENV !== "development"
    ? async () => {
        return Object.keys(config.repos).map((repo) => ({
          repo,
        }));
      }
    : undefined;

export default async function ContributionLayout({ children }: Props) {
  return (
    <div className="min-h-screen space-y-6">
      <div className="flex justify-center">
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
