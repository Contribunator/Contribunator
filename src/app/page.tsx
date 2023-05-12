import UserInfo from "@/components/header/userInfo";
import Version from "@/components/version";
import config from "@/config";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";

export default function Home() {
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
        {/* @ts-expect-error Server Component */}
        <UserInfo />
      </div>
      <Version />
    </div>
  );
}
