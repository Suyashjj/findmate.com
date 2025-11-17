"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Step1Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const INPUT_CLASS =
  "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-2";

export const UPLOAD_BUTTON_APPEARANCE = {
  button:
    "bg-gradient-to-r from-amber-600 to-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-amber-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  allowedContent: "text-xs text-gray-500 mt-2",
};

export default function BasicInfo({ formData, updateFormData }: Step1Props) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>

      <div>
        <label className={LABEL_CLASS}>Profile Photo</label>
        {formData.profilePhoto ? (
          <div className="flex items-center gap-4">
            <img
              src={formData.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
            />
            <button
              onClick={() => updateFormData({ profilePhoto: "" })}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {uploadingPhoto ? (
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="text-center">
                {uploadingPhoto ? (
                  <p className="text-sm text-orange-600 font-medium">Uploading photo...</p>
                ) : (
                  <UploadButton<OurFileRouter, "profileImage">
                    endpoint="profileImage"
                    onBeforeUploadBegin={(files: File[]) => {
                      setUploadingPhoto(true);
                      return files;
                    }}
                    onClientUploadComplete={(res: any) => {
                      setUploadingPhoto(false);
                      if (res?.[0]?.url) {
                        updateFormData({ profilePhoto: res[0].url });
                        toast.success("Photo uploaded successfully!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setUploadingPhoto(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    appearance={UPLOAD_BUTTON_APPEARANCE}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className={INPUT_CLASS}
          placeholder="Enter your full name"
          required
          maxLength={100}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            updateFormData({ email: e.target.value.toLowerCase().trim() })
          }
          className={INPUT_CLASS}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            updateFormData({ phone: formatted });
          }}
          className={INPUT_CLASS}
          placeholder="9876543210"
          maxLength={10}
        />
        {formData.phone && formData.phone.length < 10 && (
          <p className="text-xs text-orange-600 mt-1">
            Phone number should be 10 digits
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => {
              const age = parseInt(e.target.value);
              if (e.target.value === "" || (age >= 18 && age <= 100)) {
                updateFormData({ age: e.target.value });
              }
            }}
            className={INPUT_CLASS}
            placeholder="25"
            min="18"
            max="100"
          />
          {formData.age &&
            (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) && (
              <p className="text-xs text-red-600 mt-1">
                Age must be between 18 and 100
              </p>
            )}
        </div>

        <div>
          <label className={LABEL_CLASS}>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
