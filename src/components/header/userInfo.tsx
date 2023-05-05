import { CustomSession } from "@/types";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import LoginButton from "./loginButton";

import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

const UserInfo = async () => {
  const session = (await getServerSession(authOptions)) as CustomSession;
  return (
    <div className="flex items-center space-x-2">
      {session ? (
        <>
          <span>{session.user.name}</span>
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
        <span>Anonymous</span>
      )}
      <LoginButton session={session} />
    </div>
  );
};

export default UserInfo;
