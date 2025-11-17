"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  IndianRupee, 
  User, 
  Trash2,
  Eye,
  Users
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Buddy {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  age: number | null;
  gender: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
}

interface Connection {
  connectionId: string;
  postId: string;
  buddy: Buddy;
  post: {
    id: string;
    name: string;
    age: number;
    gender: string;
    city: string;
    state: string;
    budgetMin: number;
    budgetMax: number;
    currentAddress: string;
    additionalDetails: string;
    profilePhoto: string | null;
  };
  connectedAt: string;
}

export default function RoomBuddiesPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/connections");
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      } else {
        toast.error("Failed to load connections");
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (connectionId: string, buddyName: string) => {
    if (!confirm(`Remove ${buddyName} from your connections?`)) {
      return;
    }

    setDeletingId(connectionId);

    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Connection removed successfully");
        setConnections((prev) =>
          prev.filter((conn) => conn.connectionId !== connectionId)
        );
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove connection");
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewProfile = (connectionId: string) => {
    router.push(`/dashboard/room-buddies/${connectionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">Room Buddies</h1>
            </div>
            <p className="text-gray-600">
              {connections.length} {connections.length === 1 ? "connection" : "connections"}
            </p>
          </div>

          {/* Empty State */}
          {connections.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No connections yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start searching for roommates and send connection requests!
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Search Roommates
              </button>
            </div>
          ) : (
            /* Connections Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <div
                  key={connection.connectionId}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center mb-5">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden mb-3 ring-4 ring-orange-50">
                        {connection.buddy.profilePhoto ? (
                          <img
                            src={connection.buddy.profilePhoto}
                            alt={connection.buddy.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {connection.buddy.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>{connection.buddy.city}, {connection.buddy.state}</span>
                      </div>
                    </div>

                    {/* Info Cards */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Age & Gender</span>
                          <span className="text-sm font-bold text-gray-900">
                            {connection.buddy.age} years, {connection.buddy.gender}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Budget Range</span>
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {connection.buddy.budgetMin?.toLocaleString()} - {connection.buddy.budgetMax?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Date */}
                    <p className="text-xs text-center text-gray-500 mb-4 bg-gray-50 py-2 rounded-md">
                      Connected on {new Date(connection.connectedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleViewProfile(connection.connectionId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Profile
                      </button>
                      <button
                        onClick={() => handleDelete(connection.connectionId, connection.buddy.name)}
                        disabled={deletingId === connection.connectionId}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-red-100"
                      >
                        {deletingId === connection.connectionId ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Remove Connection
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}