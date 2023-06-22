import Image from "next/image";

import useUser from "./useUser";
import LoginButton from "./loginButton";
import { AuthType } from "@/types";

type Props = {
  authorization: AuthType[];
};

export default function UserInfo(props: Props) {
  // skip if no github auth
  if (!props.authorization.includes("github")) {
    return null;
  }

  // @ts-expect-error Server Component
  return <UserInfoInner {...props} />;
}

async function UserInfoInner({ authorization }: Props) {
  const user = await useUser();
  const canGithub = authorization.includes("github");
  const canAnon = authorization.find((item) =>
    ["anon", "captcha"].includes(item)
  );
  return (
    <div className="flex items-center space-x-2 justify-center">
      {!!user && (
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
      )}
      {!user && canAnon && (
        <span>
          Contributing{" "}
          <div
            className="tooltip tooltip-bottom	before:mt-2 after:mt-2 cursor-pointer"
            data-tip="To have your contributions credited, you can optionally sign in to Github."
          >
            <b>Anonymously</b>*
          </div>
        </span>
      )}
      {canGithub && <LoginButton loggedIn={!!user} />}
    </div>
  );
}
