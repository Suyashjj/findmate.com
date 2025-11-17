import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance (server-side only)
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  return generatedSignature === signature;
}

// Calculate premium expiry date
export function calculatePremiumExpiry(plan: string): Date {
  const now = new Date();
  if (plan === "6_months") {
    now.setMonth(now.getMonth() + 6);
  } else if (plan === "1_year") {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now;
}

// Get amount based on plan
export function getPlanAmount(plan: string): number {
  return plan === "6_months" ? 399 : 599;
}