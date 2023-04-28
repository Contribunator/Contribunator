import { DefaultUser, Session } from "next-auth";
import { IconType } from "react-icons";

// TODO move this?
type CustomUser = DefaultUser & {
  login?: string | null;
};

type CustomSession = Session & {
  user: CustomUser;
};
