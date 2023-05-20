import { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

import { clientId, clientSecret } from "@/util/env";

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // persist the access_token and user id to the token
      if (account) {
        token.accessToken = account.access_token;
        token.login = (profile as GithubProfile).login;
      }
      return token;
    },
  },
};

export default authOptions;
