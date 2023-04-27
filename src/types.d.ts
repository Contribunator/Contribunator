import { DefaultUser, Session } from "next-auth";
import { IconType } from "react-icons";

// TODO move this?
type CustomUser = DefaultUser & {
  login?: string | null;
};

type CustomSession = Session & {
  user: CustomUser;
};

export type C11RContribution = {
  name: string;
  type: string;
  description?: string;
  options?: { [key: string]: any };
  icon?: IconType;
};

export type C11RRepo = {
  name: string;
  repo: string;
  base: string;
  contributions: C11RContribution[];
};

export type C11RConfig = {
  owner: string;
  repos: C11RRepo[];
};
