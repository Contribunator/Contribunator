import { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

// TODO move env imports to a single file?
// TODO do we still need to do the token secrets stuff?

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // persist the access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.login = (profile as GithubProfile).login;
      }
      return token;
    },
  },
};

export default authOptions;
