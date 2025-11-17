import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Get user's pending connection requests (notifications)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to find user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    // If user doesn't exist, create them
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Create the user in database
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          profileCompleted: false,
        },
        select: { id: true },
      });
    }

    // Get pending requests received by this user
    const pendingRequests = await prisma.connectionRequest.findMany({
      where: {
        receiverId: user.id,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            profilePhoto: true,
            city: true,
          },
        },
        post: {
          select: {
            name: true,
            city: true,
            currentAddress: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}