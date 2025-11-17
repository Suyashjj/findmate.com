"use client";

import toast from "react-hot-toast";

interface Step2Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const INTEREST_OPTIONS = [
  "Chess", "Carrom", "Video Games", "Board Games", "Reading",
  "Cricket", "Football", "Badminton", "Cycling", "Gym",
  "Dance", "Singing", "Coding", "Photography", "Cooking"
];

const MAX_INTERESTS = 7;
const INPUT_CLASS = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-2";

export default function Preferences({ formData, updateFormData }: Step2Props) {
  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    
    if (currentInterests.includes(interest)) {
      updateFormData({
        interests: currentInterests.filter((i: string) => i !== interest)
      });
    } else {
      if (currentInterests.length < MAX_INTERESTS) {
        updateFormData({
          interests: [...currentInterests, interest]
        });
      } else {
        toast.error(`You can select maximum ${MAX_INTERESTS} interests`);
      }
    }
  };

  const formatBudget = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Location & Preferences</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className={INPUT_CLASS}
            placeholder="e.g., Bhopal"
            required
            maxLength={50}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className={INPUT_CLASS}
            placeholder="e.g., Madhya Pradesh"
            required
            maxLength={50}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Budget Min (₹/month)</label>
          <input
            type="number"
            value={formData.budgetMin}
            onChange={(e) => {
              const value = formatBudget(e.target.value);
              updateFormData({ budgetMin: value });
            }}
            className={INPUT_CLASS}
            placeholder="5000"
            min="0"
            max="1000000"
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Budget Max (₹/month)</label>
          <input
            type="number"
            value={formData.budgetMax}
            onChange={(e) => {
              const value = formatBudget(e.target.value);
              updateFormData({ budgetMax: value });
            }}
            className={INPUT_CLASS}
            placeholder="15000"
            min="0"
            max="1000000"
          />
        </div>
      </div>

      {formData.budgetMin && formData.budgetMax && parseInt(formData.budgetMin) > parseInt(formData.budgetMax) && (
        <p className="text-sm text-red-600 -mt-2">
          ⚠️ Minimum budget cannot be greater than maximum budget
        </p>
      )}

      <div>
        <label className={LABEL_CLASS}>Food Preference</label>
        <select
          value={formData.foodPreference}
          onChange={(e) => updateFormData({ foodPreference: e.target.value })}
          className={INPUT_CLASS}
        >
          <option value="">Select preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Jain">Jain</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smoking"
            checked={formData.smoking}
            onChange={(e) => updateFormData({ smoking: e.target.checked })}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="smoking" className="ml-2 text-sm text-gray-700">
            Smoking
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="drinking"
            checked={formData.drinking}
            onChange={(e) => updateFormData({ drinking: e.target.checked })}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="drinking" className="ml-2 text-sm text-gray-700">
            Drinking
          </label>
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Interests & Hobbies (Select up to {MAX_INTERESTS})
        </label>
        <div className="grid grid-cols-3 gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = formData.interests?.includes(interest);
            const isDisabled = !isSelected && (formData.interests?.length >= MAX_INTERESTS);
            
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
        <p
          className={`text-xs mt-2 ${
            formData.interests?.length >= MAX_INTERESTS
              ? "text-orange-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Selected: {formData.interests?.length || 0} / {MAX_INTERESTS}
          {formData.interests?.length >= MAX_INTERESTS && " (Maximum reached)"}
        </p>
      </div>

      <div>
        <label className={LABEL_CLASS}>About Yourself</label>
        <textarea
          value={formData.about}
          onChange={(e) => updateFormData({ about: e.target.value })}
          rows={4}
          className={INPUT_CLASS}
          placeholder="Tell us about yourself, your lifestyle, or anything not covered above..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {formData.about?.length || 0} / 500 characters
        </p>
      </div>
    </div>
  );
}
