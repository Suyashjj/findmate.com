"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SendRequestButtonProps {
  postId: string;
  postUserId: string;
  postOwnerName: string;
  currentUserId: string | null;
}

export default function SendRequestButton({
  postId,
  postUserId,
  postOwnerName,
  currentUserId,
}: SendRequestButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Don't show button if viewing own post
  if (currentUserId === postUserId) {
    return null;
  }

  const handleSendRequest = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.status === 403 && data.needsPremium) {
        // User needs premium
        toast.error("Premium subscription required 🔒", {
          duration: 3000,
        });
        setTimeout(() => {
          router.push("/dashboard/pricing");
        }, 1500);
        return;
      }

      if (response.status === 409) {
        // Already sent
        toast.error(`Request already ${data.status}`);
        setRequestSent(true);
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Failed to send request");
        return;
      }

      // Success
      toast.success(`Request sent to ${postOwnerName}! 🎉`, {
        duration: 3000,
      });
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (requestSent) {
    return (
      <button
        disabled
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium"
      >
        Request Sent ✓
      </button>
    );
  }

  return (
    <button
      onClick={handleSendRequest}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-colors text-sm font-medium disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send Request"}
    </button>
  );
}