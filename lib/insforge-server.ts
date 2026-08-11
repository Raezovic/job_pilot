import { cookies } from "next/headers";
import { createServerClient, createAuthActions } from "@insforge/sdk/ssr";

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient({ cookies: cookieStore });
};

export const createInsforgeAuthActions = async () => {
  const cookieStore = await cookies();
  return createAuthActions({ cookies: cookieStore });
};
