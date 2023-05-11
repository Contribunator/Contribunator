import Image from "next/image";

import LoginButton from "./loginButton";
import useUser from "../useUser";

export default async function UserInfo() {
  const user = await useUser();
  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <span>
            Contributing as <b>{user.name}</b>
          </span>
          {user.image && (
            <Image
              className="rounded-full"
              src={user.image}
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
      <LoginButton loggedIn={!!user} />
    </div>
  );
}
