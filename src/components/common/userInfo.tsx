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
  const canAnon = authorization.find((item) =>
    ["anon", "captcha"].includes(item)
  );
  return (
    <div className="flex items-center space-x-2">
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
            className="tooltip tooltip-bottom tooltip-warning	before:mt-1 after:mt-1 cursor-pointer"
            data-tip="You contributions will not be credited and you'll need to complete a CAPTCHA"
          >
            <b>Anonymously</b>*
          </div>
        </span>
      )}

      <LoginButton loggedIn={!!user} />
    </div>
  );
}
