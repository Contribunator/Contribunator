import { BiListPlus } from "react-icons/bi";
import Link from "next/link";

import UserInfo from "@/components/common/userInfo";

type Props = {
  children: React.ReactNode;
};

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
