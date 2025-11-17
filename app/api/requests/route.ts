import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// POST - Send connection request
export async function POST(request: NextRequest) {
  console.log("🔥 SEND REQUEST ROUTE HIT!");
  
  try {
    const { userId } = await auth();
    console.log("✅ User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get sender's database record
    let sender = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true, 
        isPremium: true, 
        premiumExpiry: true,
        name: true,
        email: true 
      },
    });

    // Create user if doesn't exist
    if (!sender) {
      console.log("⚠️ Sender not found in DB, creating...");
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      sender = await prisma.user.create({
        data: {
          clerkId: userId,
          name: clerkUser.firstName + " " + clerkUser.lastName || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          profileCompleted: false,
        },
        select: { 
          id: true, 
          isPremium: true, 
          premiumExpiry: true,
          name: true,
          email: true 
        },
      });
      console.log("✅ Sender created:", sender);
    }

    // Check if user is premium and subscription is active
    if (!sender.isPremium || !sender.premiumExpiry || sender.premiumExpiry < new Date()) {
      console.log("❌ User not premium or expired");
      return NextResponse.json(
        { error: "Premium subscription required", needsPremium: true },
        { status: 403 }
      );
    }
    console.log("✅ User is premium");

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    // Get the post to find receiver
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, name: true, city: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Can't send request to own post
    if (post.userId === sender.id) {
      return NextResponse.json(
        { error: "Cannot send request to your own post" },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.connectionRequest.findUnique({
      where: {
        senderId_postId: {
          senderId: sender.id,
          postId: postId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: "Request already sent",
          status: existingRequest.status 
        },
        { status: 409 }
      );
    }

    // Create connection request
    const connectionRequest = await prisma.connectionRequest.create({
      data: {
        senderId: sender.id,
        receiverId: post.userId,
        postId: postId,
        status: "pending",
      },
      include: {
        sender: {
          select: { name: true, email: true, profilePhoto: true },
        },
        post: {
          select: { name: true, city: true, currentAddress: true },
        },
      },
    });

    console.log("✅ Connection request created:", connectionRequest.id);

    return NextResponse.json({
      success: true,
      message: "Request sent successfully",
      request: connectionRequest,
    });
  } catch (error) {
    console.error("❌ Error sending request:", error);
    return NextResponse.json(
      { 
        error: "Failed to send request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET - Get user's sent and received requests
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

    // Get both sent and received requests
    const [sentRequests, receivedRequests] = await Promise.all([
      prisma.connectionRequest.findMany({
        where: { senderId: user.id },
        include: {
          receiver: {
            select: { name: true, email: true, profilePhoto: true },
          },
          post: {
            select: { name: true, city: true, currentAddress: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.connectionRequest.findMany({
        where: { receiverId: user.id },
        include: {
          sender: {
            select: { name: true, email: true, profilePhoto: true },
          },
          post: {
            select: { name: true, city: true, currentAddress: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      sent: sentRequests,
      received: receivedRequests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}