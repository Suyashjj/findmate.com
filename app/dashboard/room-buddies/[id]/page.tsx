"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  MapPin, 
  IndianRupee, 
  User, 
  Phone, 
  Utensils, 
  Cigarette, 
  Wine,
  Home,
  FileText,
  ExternalLink,
  FileIcon,
  ArrowLeft,
  Crown,
  Lock
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
  socialLinks: string[];
  documents: string[];
  foodPreference: string | null;
  smoking: boolean;
  drinking: boolean;
  interests: string[];
}

interface Post {
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
  foodPreference: string | null;
  smoking: boolean;
  drinking: boolean;
  interests: string[];
}

interface Connection {
  connectionId: string;
  postId: string;
  buddy: Buddy;
  post: Post;
  connectedAt: string;
}

interface CurrentUser {
  isPremium: boolean;
}

export default function FullProfilePage() {
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id as string;

  const [connection, setConnection] = useState<Connection | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [connectionId]);

  const fetchData = async () => {
    try {
      // Fetch connections
      const connectionsResponse = await fetch("/api/connections");
      if (!connectionsResponse.ok) {
        toast.error("Failed to load connection");
        router.push("/dashboard/room-buddies");
        return;
      }

      const connectionsData = await connectionsResponse.json();
      const foundConnection = connectionsData.connections.find(
        (conn: Connection) => conn.connectionId === connectionId
      );

      if (!foundConnection) {
        toast.error("Connection not found");
        router.push("/dashboard/room-buddies");
        return;
      }

      setConnection(foundConnection);

      // Fetch current user's premium status
      const profileResponse = await fetch("/api/profile");
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCurrentUser({ isPremium: profileData.isPremium || false });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Connection not found</p>
          <button
            onClick={() => router.push("/dashboard/room-buddies")}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPremium = currentUser?.isPremium || false;
  const { buddy, post } = connection;

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/dashboard/room-buddies")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Room Buddies</span>
          </button>

          {/* Premium Status Banner */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 rounded-xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      Upgrade to Access Full Contact Details
                    </h3>
                    <p className="text-orange-100 text-sm">
                      Get phone number, social links & documents!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/dashboard/pricing")}
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-xl transform hover:scale-105"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 border-b border-gray-200">
              <div className="flex items-center gap-6">
                {/* Profile Photo */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                  {buddy.profilePhoto ? (
                    <img
                      src={buddy.profilePhoto}
                      alt={buddy.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>

                {/* Name & Location */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{buddy.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-lg">{buddy.city}, {buddy.state}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">Age & Gender</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {buddy.age} years, {buddy.gender}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <IndianRupee className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">Budget Range</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{buddy.budgetMin?.toLocaleString()} - ₹{buddy.budgetMax?.toLocaleString()}
                  </p>
                </div>

                {/* Contact - Premium Feature */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">Contact</span>
                  </div>
                  {isPremium && buddy.phone ? (
                    <a
                      href={`tel:${buddy.phone}`}
                      className="text-lg font-bold text-orange-600 hover:text-orange-700 hover:underline block"
                    >
                      {buddy.phone}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-bold text-gray-400">Premium Only</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Home className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">Current Address</h2>
                </div>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {post.currentAddress}
                </p>
              </div>

              {/* Preferences Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Preferences & Lifestyle
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Utensils className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Food</p>
                      <p className="font-medium text-gray-900">
                        {buddy.foodPreference || post.foodPreference || "Any"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Cigarette className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Smoking</p>
                      <p className="font-medium text-gray-900">
                        {buddy.smoking || post.smoking ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Wine className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Drinking</p>
                      <p className="font-medium text-gray-900">
                        {buddy.drinking || post.drinking ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              {((buddy.interests && buddy.interests.length > 0) || (post.interests && post.interests.length > 0)) && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Interests & Hobbies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(buddy.interests || post.interests || []).map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links - Premium Feature */}
              {isPremium && buddy.socialLinks && buddy.socialLinks.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <ExternalLink className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Social Media Links</h2>
                  </div>
                  <div className="space-y-2">
                    {buddy.socialLinks.map((link: string, index: number) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:underline bg-orange-50 p-3 rounded-lg border border-orange-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="break-all">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!isPremium && buddy.socialLinks && buddy.socialLinks.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <ExternalLink className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Social Media Links</h2>
                    <Lock className="w-4 h-4 text-gray-400 ml-1" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Upgrade to premium to view social media links
                    </p>
                  </div>
                </div>
              )}

              {/* Documents - Premium Feature */}
              {isPremium && buddy.documents && buddy.documents.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <FileIcon className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Documents</h2>
                  </div>
                  <div className="space-y-2">
                    {buddy.documents.map((doc: string, index: number) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-orange-600 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
                      >
                        <FileIcon className="w-5 h-5 text-orange-600" />
                        <span className="flex-1 truncate">Document {index + 1}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!isPremium && buddy.documents && buddy.documents.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <FileIcon className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Documents</h2>
                    <Lock className="w-4 h-4 text-gray-400 ml-1" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Upgrade to premium to view documents
                    </p>
                  </div>
                </div>
              )}

              {/* About Section */}
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">About & Additional Details</h2>
                </div>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-200">
                  {post.additionalDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}