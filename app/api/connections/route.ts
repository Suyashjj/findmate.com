import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET - Fetch user's accepted connections (room buddies)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all accepted connections where user is either sender or receiver
    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "accepted" },
          { receiverId: user.id, status: "accepted" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            city: true,
            state: true,
            phone: true,
            age: true,
            gender: true,
            budgetMin: true,
            budgetMax: true,
            socialLinks: true,
            documents: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            city: true,
            state: true,
            phone: true,
            age: true,
            gender: true,
            budgetMin: true,
            budgetMax: true,
            socialLinks: true,
            documents: true,
          },
        },
        post: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            city: true,
            state: true,
            budgetMin: true,
            budgetMax: true,
            currentAddress: true,
            additionalDetails: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform data to show the "other" user (not the current user)
    const buddies = connections.map((connection) => {
      const isCurrentUserSender = connection.senderId === user.id;
      const buddy = isCurrentUserSender ? connection.receiver : connection.sender;

      return {
        connectionId: connection.id,
        postId: connection.postId,
        buddy: buddy,
        post: connection.post,
        connectedAt: connection.updatedAt,
      };
    });

    return NextResponse.json({
      count: buddies.length,
      connections: buddies,
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}