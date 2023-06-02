import Link from "next/link";
import { BiListPlus } from "react-icons/bi";

import config from "@/lib/config";

import UserInfo from "@/components/common/userInfo";

export default function LandingPage() {
  return (
    <div className="space-y-6">
      <div className="cell cell-hero">
        <h1 className="title">{config.title}</h1>
        <p className="my-6">{config.description}</p>
        <Link href="/contribute" className="btn btn-primary btn-lg gap-2">
          Contribute
          <BiListPlus className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex justify-center">
        <UserInfo />
      </div>
    </div>
  );
}