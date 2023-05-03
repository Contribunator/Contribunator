"use client";

import { CustomSession } from "@/types";
import { signIn, signOut } from "next-auth/react";

type Props = {
  session: CustomSession | null;
};

export default function LoginButton({ session }: Props) {
  if (session) {
    return (
      <button onClick={() => signOut()} className="btn">
        Sign out
      </button>
    );
  }
  return (
    <button onClick={() => signIn()} className="btn btn-primary">
      Sign in
    </button>
  );
}
