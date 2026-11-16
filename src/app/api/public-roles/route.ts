import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { inArray } from "drizzle-orm";

export async function GET() {
  try {
    const roles = await db
      .select({
        id: schema.roles.id,
        name: schema.roles.name,
        description: schema.roles.description,
      })
      .from(schema.roles)
      .where(inArray(schema.roles.name, ["Viewer", "Data Analyst"]));

    return NextResponse.json({ success: true, roles });
  } catch {
    // Safe hardcoded seed fallback if database query fails
    return NextResponse.json({
      success: true,
      roles: [
        {
          id: "829d8263-7403-4097-b8c0-ae07189c5675",
          name: "Viewer",
          description: "Read-only access to assigned datasets and data views",
        },
        {
          id: "1e56fcdf-8ffe-4fb2-833d-1b4fa6687d37",
          name: "Data Analyst",
          description: "Analytical data exploration, saved views, query analytics, and reporting",
        },
      ],
    });
  }
}
