import Link from "next/link";

import DefaultLayout from "../layouts/defaultLayout";
import { HiHome, HiOutlineEmojiSad } from "react-icons/hi";

export default function LandingPage() {
  return (
    <DefaultLayout>
      <div className="cell cell-hero">
        <HiOutlineEmojiSad className="inline text-6xl" />
        <h1 className="title">Page Not Found</h1>
        <p>Sorry, the resource you are looking for does not exist.</p>
      </div>
      <Link href="/" className="btn btn-accent">
        Go Home
        <HiHome className="h-4 w-4" />
      </Link>
    </DefaultLayout>
  );
}
