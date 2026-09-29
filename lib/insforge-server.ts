import { cookies } from "next/headers";
import { createServerClient, createAuthActions } from "@insforge/sdk/ssr";
import { createAdminClient } from "@insforge/sdk";
import dns from "node:dns";

// Ensure Node server fetch prefers IPv4 to prevent DNS64/IPv6 timeout when contacting S3/InsForge
if (typeof globalThis !== "undefined" && !(globalThis as unknown as { __ipv4DispatcherSet?: boolean }).__ipv4DispatcherSet) {
  (globalThis as unknown as { __ipv4DispatcherSet?: boolean }).__ipv4DispatcherSet = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Agent, setGlobalDispatcher } = require("undici");
    const agent = new Agent({
      connect: {
        lookup: (hostname: string, options: Record<string, unknown>, callback: (...args: unknown[]) => void) => {
          dns.lookup(hostname, { ...options, family: 4 }, callback);
        },
      },
    });
    setGlobalDispatcher(agent);
  } catch {
    // Fallback quietly if undici is not directly requireable
  }
}

export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient({ cookies: cookieStore });
};

export const createInsforgeAuthActions = async () => {
  const cookieStore = await cookies();
  return createAuthActions({ cookies: cookieStore });
};

export const createInsforgeAdmin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const apiKey = process.env.NEXT_PUBLIC_INSFORGE_API || process.env.INSFORGE_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Missing InsForge URL or API key in environment.");
  }

  return createAdminClient({
    baseUrl,
    apiKey,
  });
};
