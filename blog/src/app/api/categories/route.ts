import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { categories } from "@/src/db/schemas/posts.sql";
import { eq, sql } from "drizzle-orm";
import { checkPermission } from "@/src/lib/auth/check-permission";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(
      { data: allCategories, message: "All categories fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: null, error: "Failed to retrieve categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return await checkPermission(
    { requiredPermission: "posts:create" },
    async () => {
      try {
        const { name, slug } = await request.json();

        if (!name || !slug) {
          return NextResponse.json(
            { error: "Name and slug are required" },
            { status: 400 }
          );
        }

        const newCategory = await db
          .insert(categories)
          .values({ name, slug })
          .onDuplicateKeyUpdate({ set: { name: sql`name`, slug: sql`slug` } });
        return NextResponse.json(
          { data: newCategory, message: "Category created successfully" },
          { status: 201 }
        );
      } catch (error) {
        return NextResponse.json(
          { data: null, error: "Failed to create category" },
          { status: 500 }
        );
      }
    }
  );
}
