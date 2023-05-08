"use client";

import { CustomSession } from "@/types";
import { signIn, signOut } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

type Props = {
  session: CustomSession | null;
};

export default function LoginButton({ session }: Props) {
  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="btn btn-sm gap-2 btn-outline"
      >
        Sign out
        <HiOutlineLogout />
      </button>
    );
  }
  return (
    <button onClick={() => signIn()} className="btn btn-sm gap-2">
      Sign in with Github
      <FaGithub />
    </button>
  );
}
