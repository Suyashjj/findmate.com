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
  Lock,
  Sparkles,
  Crown
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface ProfileData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string | null;
  city: string;
  state: string;
  budgetMin: number;
  budgetMax: number;
  currentAddress: string;
  additionalDetails: string;
  foodPreference: string | null;
  smoking: boolean;
  drinking: boolean;
  interests: string[];
  profilePhoto: string | null;
}

export default function ProfileViewPage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Premium Unlock Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Unlock Full Profile Access
                  </h3>
                  <p className="text-orange-100 text-sm">
                    Get contact details, send unlimited requests & connect instantly!
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

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 border-b border-gray-200">
              <div className="flex items-center gap-6">
                {/* Profile Photo */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden shadow-lg">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>

                {/* Name & Location */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span className="text-lg">{profile.city}, {profile.state}</span>
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
                    {profile.age} years, {profile.gender}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <IndianRupee className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">Budget Range</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{profile.budgetMin.toLocaleString()} - ₹{profile.budgetMax.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">Contact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-bold text-gray-400">Premium Only</p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Home className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">Current Address</h2>
                </div>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {profile.currentAddress}
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
                        {profile.foodPreference || "Any"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Cigarette className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Smoking</p>
                      <p className="font-medium text-gray-900">
                        {profile.smoking ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Wine className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Drinking</p>
                      <p className="font-medium text-gray-900">
                        {profile.drinking ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              {profile.interests.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Interests & Hobbies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
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

              {/* About Section */}
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold">About & Additional Details</h2>
                </div>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-200">
                  {profile.additionalDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}