import { BiListPlus } from "react-icons/bi";
import Link from "next/link";

import UserInfo from "@/components/common/userInfo";
import FlexContainer from "@/components/common/flexContainer";

type Props = {
  children: React.ReactNode;
};

export default async function ContributionLayout({ children }: Props) {
  return (
    <FlexContainer>
      <div className="flex justify-center">
        <UserInfo />
      </div>
      <div className="divider"></div>
      {children}
      <Link className="btn gap-2" href="/contribute">
        Contributions List
        <BiListPlus className="h-5 w-5" />
      </Link>
    </FlexContainer>
  );
}
