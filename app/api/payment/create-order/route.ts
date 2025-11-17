import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { razorpayInstance, getPlanAmount } from "@/lib/razorpay";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  console.log("🔥 CREATE ORDER ROUTE HIT!");
  
  try {
    const { userId } = await auth();
    console.log("✅ User ID:", userId);

    if (!userId) {
      console.log("❌ Unauthorized - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's database ID - CREATE IF NOT EXISTS
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, name: true },
    });

    // If user doesn't exist in database, create them
    if (!user) {
      console.log("⚠️ User not found in DB, creating...");
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: "Clerk user not found" }, { status: 404 });
      }

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          name: clerkUser.firstName + " " + clerkUser.lastName || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          profileCompleted: false,
        },
        select: { id: true, email: true, name: true },
      });
      console.log("✅ User created:", user);
    } else {
      console.log("✅ User found:", user);
    }

    const { plan } = await request.json();
    console.log("✅ Plan:", plan);

    if (!plan || !["6_months", "1_year"].includes(plan)) {
      console.log("❌ Invalid plan");
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = getPlanAmount(plan);
    console.log("✅ Amount:", amount);

    // Create a short receipt ID (max 40 chars)
    // Use timestamp + random string for uniqueness
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const shortReceipt = `rcpt_${timestamp.slice(-10)}_${randomStr}`; // Total: ~25 chars
    console.log("✅ Receipt ID:", shortReceipt);

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        userId: user.id,
        plan: plan,
        email: user.email,
      },
    });
    console.log("✅ Razorpay order created:", order.id);

    // Create pending payment record in database
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: amount,
        currency: "INR",
        plan: plan,
        razorpayOrderId: order.id,
        status: "pending",
      },
    });
    console.log("✅ Payment record created");

    return NextResponse.json({
      orderId: order.id,
      amount: amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}