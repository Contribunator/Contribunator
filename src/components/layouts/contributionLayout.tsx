import { HiOutlineArrowLeft } from "react-icons/hi";
import Link from "next/link";

import FlexContainer from "@/components/common/flexContainer";

type Props = {
  children: React.ReactNode;
};

export default async function ContributionLayout({ children }: Props) {
  return (
    <FlexContainer>
      {children}
      <Link className="btn gap-2" href="/contribute">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Contributions List
      </Link>
    </FlexContainer>
  );
}
