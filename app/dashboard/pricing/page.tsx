"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubscribe = async (plan: "6_months" | "1_year") => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    // Check if Razorpay is loaded, if not try to use it anyway
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Please refresh the page.");
      return;
    }

    setLoading(plan);

    try {
      console.log("🔥 Starting payment process for plan:", plan);

      // Step 1: Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      console.log("📡 Order response status:", orderResponse.status);

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        console.error("❌ Order creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      console.log("✅ Order data received:", orderData);

      // Step 2: Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "FindMate",
        description: `Premium ${plan === "6_months" ? "6 Months" : "1 Year"} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          console.log("💳 Payment response:", response);
          
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              const data = await verifyResponse.json();
              console.log("✅ Payment verified:", data);
              
              toast.success("Payment successful! You're now premium! 🎉", {
                duration: 5000,
              });
              
              // Set redirecting state
              setIsRedirecting(true);
              setLoading(null);
              
              // Show redirecting message
              toast.loading("Redirecting to dashboard...", {
                duration: 2000,
              });
              
              setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
              }, 2000);
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              console.error("❌ Verification failed:", errorData);
              toast.error("Payment verification failed");
              setLoading(null);
            }
          } catch (error) {
            console.error("❌ Verification error:", error);
            toast.error("Payment verification failed");
            setLoading(null);
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.emailAddresses[0]?.emailAddress || "",
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Payment cancelled by user");
            setLoading(null);
            toast.error("Payment cancelled");
          },
        },
      };

      console.log("🚀 Opening Razorpay checkout...");
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong!");
      setLoading(null);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log("✅ Razorpay script loaded");
          setRazorpayLoaded(true);
        }}
        onError={(e) => {
          console.error("❌ Failed to load Razorpay script", e);
          setRazorpayLoaded(true); // Set to true anyway to allow button clicks
          toast.error("Payment gateway may not load properly. Try refreshing if payment fails.");
        }}
        strategy="lazyOnload"
      />
      
      <Toaster position="top-right" />
      
      {/* Redirecting Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <svg className="animate-spin h-12 w-12 text-orange-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
      
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Premium Plans
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unlock Premium Features
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Send unlimited connection requests and find your perfect roommate faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 6 Months Plan */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 hover:shadow-xl hover:scale-105 hover:border-gray-300 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  6 Months Plan
                </h3>
                <p className="text-gray-600">Perfect for short-term searches</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">₹399</span>
                </div>
                <p className="text-gray-500 mt-2">Valid for 6 months</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Send connection requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">View full profiles after acceptance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access social links & documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe("6_months")}
                disabled={loading === "6_months" || isRedirecting}
                className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading === "6_months" ? "Processing..." : "Get Started"}
              </button>
            </div>

            {/* 1 Year Plan */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-500 p-8 relative hover:shadow-2xl hover:scale-105 hover:border-orange-600 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  1 Year Plan
                </h3>
                <p className="text-gray-600">Best value for your money</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                    ₹599
                  </span>
                </div>
                <p className="text-gray-500 mt-2">Valid for 1 year</p>
                <p className="text-green-600 font-medium mt-1">Save ₹199!</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Send connection requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">View full profiles after acceptance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access social links & documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Extended validity</span>
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe("1_year")}
                disabled={loading === "1_year" || isRedirecting}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading === "1_year" ? "Processing..." : "Get Started"}
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              💳 Secure payment powered by Razorpay
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-sm text-gray-500 mt-2">
                Test Mode: Use test card 4111 1111 1111 1111
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}