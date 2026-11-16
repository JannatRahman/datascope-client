import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
  "http://localhost",
  "http://127.0.0.1",
].filter((origin): origin is string => Boolean(origin));

type UserWithRoleId = { roleId?: string | null } & Record<string, any>;

export const auth = betterAuth({
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [
    bearer(),
    customSession(async ({ user: rawUser, session }) => {
      const user = rawUser as UserWithRoleId;
      let roleName = "Viewer";
      try {
        if (user.roleId) {
          const [roleRecord] = await db
            .select({ name: schema.roles.name })
            .from(schema.roles)
            .where(eq(schema.roles.id, user.roleId))
            .limit(1);

          if (roleRecord?.name) {
            roleName = roleRecord.name;
          }
        }
      } catch (error) {
        console.warn("[Better Auth] Error in customSession role resolution:", error);
      }
      return {
        user: {
          ...user,
          roleName,
        },
        session,
      };
    }),
  ],
  user: {
    additionalFields: {
      roleId: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData: any) => {
          try {
            // Safeguard: fetch Administrator and Viewer roles
            const allRoles = await db
              .select({ id: schema.roles.id, name: schema.roles.name })
              .from(schema.roles);

            const adminRole = allRoles.find((r) => r.name === "Administrator");
            const viewerRole = allRoles.find((r) => r.name === "Viewer");

            // If user attempts to assign Administrator on public registration, block and downgrade to Viewer
            if (adminRole && userData.roleId === adminRole.id) {
              return {
                data: {
                  ...userData,
                  roleId: viewerRole?.id,
                },
              };
            }

            // If no role specified (e.g. Google login), default to Viewer
            if (!userData.roleId && viewerRole) {
              return {
                data: {
                  ...userData,
                  roleId: viewerRole.id,
                },
              };
            }
          } catch (error) {
            console.warn("[Better Auth] Error in user create hook:", error);
          }
          return { data: userData };
        },
      },
    },
  },
});