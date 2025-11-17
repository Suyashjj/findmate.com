"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import BasicInfo from "./components/basic-info";
import LinksDocuments from "./components/links-documents";
import Preferences from "./components/preferences";

const PROFILE_STEPS = [
  { step: 1, label: "Basic Info" },
  { step: 2, label: "Preferences" },
  { step: 3, label: "Links & Docs" },
];

const INITIAL_FORM_DATA = {
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
  interests: [] as string[],
  about: "",
  socialLinks: [] as string[],
  documents: [] as string[],
};

const getProgressWidth = (step: number) => {
  if (step === 1) return "0%";
  if (step === 2) return "calc(50% - 80px)";
  return "calc(100% - 160px)";
};

export default function ProfilePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const router = useRouter();

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
              city: data.city || "",
              state: data.state || "",
              budgetMin: data.budgetMin?.toString() || "",
              budgetMax: data.budgetMax?.toString() || "",
              foodPreference: data.foodPreference || "",
              smoking: data.smoking || false,
              drinking: data.drinking || false,
              interests: data.interests || [],
              about: data.about || "",
              socialLinks: data.socialLinks || [],
              documents: data.documents || [],
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

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error("Please enter your full name");
        return false;
      }
      if (!formData.email.trim()) {
        toast.error("Please enter your email");
        return false;
      }
      if (formData.email && !formData.email.includes("@")) {
        toast.error("Please enter a valid email address");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.city.trim()) {
        toast.error("Please enter your city");
        return false;
      }
      if (!formData.state.trim()) {
        toast.error("Please enter your state");
        return false;
      }

      if (formData.budgetMin && formData.budgetMax) {
        const min = parseInt(formData.budgetMin);
        const max = parseInt(formData.budgetMax);
        if (min > max) {
          toast.error("Minimum budget cannot be greater than maximum budget");
          return false;
        }
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error("Please complete all required fields");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : null,
          budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : null,
          profileCompleted: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        toast.error(
          errorData?.message || "Failed to save profile. Please try again."
        );
        setSubmitting(false);
        return;
      }

      // WAIT BEFORE REDIRECT
      toast.success("Profile saved successfully!", {
        duration: 2000,
        position: "top-right",
      });

      setTimeout(() => {
        setSubmitting(false);
        router.push("/dashboard");
      }, 2000); // matches toast duration

    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Network error. Please try again.");
      setSubmitting(false);
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

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-12 px-4">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute top-6 left-20 right-20 h-1 bg-gray-200"></div>
                <div
                  className="absolute top-6 left-20 h-1 bg-gradient-to-r from-amber-600 to-orange-700 transition-all duration-500"
                  style={{ width: getProgressWidth(currentStep) }}
                ></div>

                <div className="relative flex justify-between items-start">
                  {PROFILE_STEPS.map((item) => (
                    <div key={item.step} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          currentStep >= item.step
                            ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-lg scale-110"
                            : "bg-white text-gray-400 border-4 border-gray-300"
                        }`}
                      >
                        {currentStep > item.step ? (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>

                      <span
                        className={`mt-3 text-sm font-medium text-center ${
                          currentStep >= item.step
                            ? "bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <BasicInfo formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <Preferences formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <LinksDocuments formData={formData} updateFormData={updateFormData} />
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-md hover:from-amber-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : "Complete Profile"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
