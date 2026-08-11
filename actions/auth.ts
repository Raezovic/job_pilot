"use server";

import { createInsforgeAuthActions } from "@/lib/insforge-server";

export async function signInWithOAuthAction(provider: "google" | "github", redirectTo: string) {
  const auth = await createInsforgeAuthActions();
  
  // We use skipBrowserRedirect: true so the action returns the URL back to the client,
  // which can then perform the window.location redirect.
  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { data };
}

export async function signOutAction() {
  const auth = await createInsforgeAuthActions();
  const { error } = await auth.signOut();
  if (error) {
    return { error: { message: error.message } };
  }
  return { success: true };
}
