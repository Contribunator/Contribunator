import UserInfo from "@/components/header/userInfo";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="cell cell-hero">
        <h1 className="title">Welcome</h1>
        <p className="my-6">
          This is some welcome text. Todo, some information about login and
          shit.
        </p>
        <Link href="/contribute" className="btn btn-primary btn-lg gap-2">
          Contribute
          <BiListPlus className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex justify-center">
        {/* @ts-expect-error Server Component */}
        <UserInfo />
      </div>
    </div>
  );
}
