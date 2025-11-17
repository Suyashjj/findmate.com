import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { verifyPaymentSignature, calculatePremiumExpiry } from "@/lib/razorpay";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  console.log("🔥 VERIFY PAYMENT ROUTE HIT!");
  
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
      select: { id: true },
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log("⚠️ User not found in DB during verify, creating...");
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
        select: { id: true },
      });
      console.log("✅ User created during verify:", user);
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();
    
    console.log("📦 Payment Details:", { razorpay_order_id, razorpay_payment_id });

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.log("❌ Invalid signature");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }
    console.log("✅ Signature verified");

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      console.log("❌ Payment record not found");
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }
    console.log("✅ Payment record found:", payment);

    // Calculate premium expiry
    const premiumExpiry = calculatePremiumExpiry(payment.plan);
    console.log("✅ Premium expiry calculated:", premiumExpiry);

    // Update payment record and user premium status
    await prisma.$transaction([
      // Update payment status
      prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "success",
        },
      }),

      // Update user premium status
      prisma.user.update({
        where: { id: user.id },
        data: {
          isPremium: true,
          premiumExpiry: premiumExpiry,
          subscriptionPlan: payment.plan,
        },
      }),
    ]);
    console.log("✅ Database updated - User is now premium!");

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      premiumExpiry: premiumExpiry,
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return NextResponse.json(
      { 
        error: "Failed to verify payment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}