import authOptions from "@/lib/server/nextAuthOptions";
import { getServerSession } from "next-auth";

export default async function useUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
