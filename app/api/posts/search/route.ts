import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const budgetMin = searchParams.get("budgetMin");
    const budgetMax = searchParams.get("budgetMax");
    const gender = searchParams.get("gender");

    // Build filter conditions
    const where: any = {
      isActive: true,
    };

    // City filter (case-insensitive)
    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    // Budget filters
    if (budgetMin) {
      where.budgetMin = {
        gte: parseInt(budgetMin),
      };
    }

    if (budgetMax) {
      where.budgetMax = {
        lte: parseInt(budgetMax),
      };
    }

    // Gender filter
    if (gender && gender !== "") {
      where.gender = gender;
    }

    // Fetch matching posts
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}