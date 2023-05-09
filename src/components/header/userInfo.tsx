import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import Image from "next/image";

import LoginButton from "./loginButton";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

const UserInfo = async () => {
  const session = (await getServerSession(authOptions)) as Session;
  return (
    <div className="flex items-center space-x-2">
      {session?.user ? (
        <>
          <span>
            Contributing as <b>{session.user.name}</b>
          </span>
          {session.user.image && (
            <Image
              className="rounded-full"
              src={session.user.image}
              alt={"User Avatar"}
              width={32}
              height={32}
            />
          )}
        </>
      ) : (
        <span>
          Contributing{" "}
          <div
            className="tooltip tooltip-bottom tooltip-warning	before:mt-1 after:mt-1 cursor-pointer"
            data-tip="You contributions will not be credited to a GitHub account"
          >
            <b>Anonymously</b>*
          </div>
        </span>
      )}
      <LoginButton session={session} />
    </div>
  );
};

export default UserInfo;
