import { createAuthClient } from "better-auth/react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const authClient = createAuthClient({
  baseURL:
    appUrl && !appUrl.includes("localhost")
      ? appUrl
      : typeof window !== "undefined"
        ? window.location.origin
        : undefined,
});

export const { useSession, signIn, signOut, signUp } = authClient;
