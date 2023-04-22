import { DefaultUser, Session } from "next-auth";

type CustomUser = DefaultUser & {
  login?: string | null;
};

type CustomSession = Session & {
  user: CustomUser;
};
