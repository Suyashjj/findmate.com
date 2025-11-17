import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// DELETE - Remove connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

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

    // Get the connection request
    const connection = await prisma.connectionRequest.findUnique({
      where: { id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    // Verify user is part of this connection
    if (
      connection.senderId !== user.id &&
      connection.receiverId !== user.id
    ) {
      return NextResponse.json(
        { error: "You are not part of this connection" },
        { status: 403 }
      );
    }

    // Delete the connection
    await prisma.connectionRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Connection removed successfully",
    });
  } catch (error) {
    console.error("Error deleting connection:", error);
    return NextResponse.json(
      { error: "Failed to delete connection" },
      { status: 500 }
    );
  }
}