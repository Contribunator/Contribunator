"use client";

import { signIn, signOut } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

export default function LoginButton({ loggedIn }: { loggedIn: boolean }) {
  if (loggedIn) {
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
