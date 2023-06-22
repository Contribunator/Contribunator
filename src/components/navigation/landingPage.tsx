import Link from "next/link";

import getConfig from "@/lib/config";

import UserInfo from "@/components/common/userInfo";
import { HiOutlineArrowRight } from "react-icons/hi";

export default async function LandingPage() {
  const config = await getConfig();
  return (
    <>
      <div className="cell cell-hero">
        <h1 className="title">{config.title}</h1>
        <p className="my-6">{config.description}</p>
        <Link href="/contribute" className="btn btn-primary btn-lg gap-3">
          Contribute
          <HiOutlineArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <UserInfo authorization={config.authorization} />
    </>
  );
}
