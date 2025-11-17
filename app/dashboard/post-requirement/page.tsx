"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  profilePhoto: string;
  city: string;
  state: string;
  budgetMin: string;
  budgetMax: string;
  foodPreference: string;
  smoking: boolean;
  drinking: boolean;
  interests: string[];
  socialLinks: string[];
  documents: string[];
  currentAddress: string;
  additionalDetails: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  profilePhoto: "",
  city: "",
  state: "",
  budgetMin: "",
  budgetMax: "",
  foodPreference: "",
  smoking: false,
  drinking: false,
  interests: [],
  socialLinks: [],
  documents: [],
  currentAddress: "",
  additionalDetails: "",
};

export default function PostRequirementPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const router = useRouter();

  // Fetch user profile and pre-fill
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              age: data.age?.toString() || "",
              gender: data.gender || "",
              profilePhoto: data.profilePhoto || "",
              city: "", // NOT pre-filled - empty now
              state: "", // NOT pre-filled - empty now
              budgetMin: data.budgetMin?.toString() || "",
              budgetMax: data.budgetMax?.toString() || "",
              foodPreference: data.foodPreference || "",
              smoking: data.smoking || false,
              drinking: data.drinking || false,
              interests: data.interests || [],
              socialLinks: data.socialLinks || [],
              documents: data.documents || [],
              currentAddress: "", // NOT pre-filled
              additionalDetails: "", // NOT pre-filled
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      toast.error("Age must be 18 or above");
      return false;
    }
    if (!formData.gender) {
      toast.error("Gender is required");
      return false;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      toast.error("City and State are required");
      return false;
    }
    if (!formData.budgetMin || !formData.budgetMax) {
      toast.error("Budget range is required");
      return false;
    }
    if (!formData.currentAddress.trim()) {
      toast.error("Current address is required");
      return false;
    }
    if (!formData.additionalDetails.trim()) {
      toast.error("Additional details are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          phone: formData.phone || null,
          city: formData.city,
          state: formData.state,
          budgetMin: parseInt(formData.budgetMin),
          budgetMax: parseInt(formData.budgetMax),
          foodPreference: formData.foodPreference || null,
          smoking: formData.smoking,
          drinking: formData.drinking,
          interests: formData.interests,
          profilePhoto: formData.profilePhoto || null,
          socialLinks: formData.socialLinks,
          documents: formData.documents,
          currentAddress: formData.currentAddress,
          additionalDetails: formData.additionalDetails,
        }),
      });

      if (response.ok) {
        toast.success("Post published successfully!", { duration: 3000 });
        setTimeout(() => {
          router.push("/dashboard/my-posts");
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.error || "Failed to publish post");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Post Your Requirement
            </h1>
            <p className="text-gray-600 mb-8">
              Fill in the details below to find your perfect roommate
            </p>

            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateFormData("gender", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Location Full Address *
                    </label>
                    <input
                      type="text"
                      value={formData.currentAddress}
                      onChange={(e) => updateFormData("currentAddress", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter the complete address of your room/flat"
                    />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Range</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Budget (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => updateFormData("budgetMin", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Min budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Budget (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => updateFormData("budgetMax", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Max budget"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Preference
                    </label>
                    <select
                      value={formData.foodPreference}
                      onChange={(e) => updateFormData("foodPreference", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select preference</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Eggetarian">Eggetarian</option>
                    </select>
                  </div>

                  <div className="flex gap-6 items-center pt-8">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.smoking}
                        onChange={(e) => updateFormData("smoking", e.target.checked)}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Smoking</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.drinking}
                        onChange={(e) => updateFormData("drinking", e.target.checked)}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Drinking</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.additionalDetails}
                    onChange={(e) => updateFormData("additionalDetails", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Describe your room, amenities, preferred roommate qualities, house rules, etc."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-md hover:from-amber-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}