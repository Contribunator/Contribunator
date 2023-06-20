import { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

import { clientId, clientSecret } from "@/lib/env";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // persist user login name
      if (account) {
        token.login = (profile as GithubProfile).login;
      }
      return token;
    },
  },
};

export default nextAuthOptions;
