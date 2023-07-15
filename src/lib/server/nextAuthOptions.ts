import { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { e2e, auth } from "@/lib/env.server";

// TODO only enable if config has it enabled

const nextAuthOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
  },
  providers: [GithubProvider(auth.github)],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.login = (profile as GithubProfile).login;
      }
      return token;
    },
  },
};

if (e2e) {
  nextAuthOptions.providers.push(
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Test Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass HTML attribute to the <input> tag through the object.
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        // password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize() {
        return {
          id: 1,
          name: "Test User",
          email: "test@email.com",
          image: "https://avatars.githubusercontent.com/u/1?v=4",
          login: "test-user",
        };
      },
    })
  );
}

export default nextAuthOptions;
