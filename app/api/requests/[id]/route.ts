import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// PUT - Accept or reject connection request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 ACCEPT/REJECT REQUEST ROUTE HIT!");
  
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

    const { action } = await request.json(); // "accept" or "reject"

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Await params before using
    const { id } = await params;

    // Get the connection request
    const connectionRequest = await prisma.connectionRequest.findUnique({
      where: { id },
      include: {
        sender: { select: { name: true, email: true } },
        post: { select: { name: true, city: true } },
      },
    });

    if (!connectionRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Only receiver can accept/reject
    if (connectionRequest.receiverId !== user.id) {
      return NextResponse.json(
        { error: "You can only respond to requests sent to you" },
        { status: 403 }
      );
    }

    // Can't change already processed request
    if (connectionRequest.status !== "pending") {
      return NextResponse.json(
        { error: `Request already ${connectionRequest.status}` },
        { status: 400 }
      );
    }

    // Update request status
    const newStatus = action === "accept" ? "accepted" : "rejected";
    
    const updatedRequest = await prisma.connectionRequest.update({
      where: { id },
      data: { status: newStatus },
      include: {
        sender: { select: { name: true, email: true, profilePhoto: true } },
        post: { select: { name: true, city: true } },
      },
    });

    console.log(`✅ Request ${newStatus}:`, updatedRequest.id);

    return NextResponse.json({
      success: true,
      message: `Request ${newStatus}`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}