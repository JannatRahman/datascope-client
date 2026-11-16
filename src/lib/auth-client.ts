import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

function resolveBaseURL(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000"
  );
}

export const authClient = createAuthClient({
  baseURL: resolveBaseURL(),
  plugins: [
    customSessionClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
