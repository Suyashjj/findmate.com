// Centralized validation utilities for profile form

export const validateEmail = (email: string): boolean => {
    if (!email) return false;
    return email.includes("@") && email.includes(".");
  };
  
  export const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10;
  };
  
  export const validateAge = (age: string): boolean => {
    if (!age) return true; // Optional field
    const ageNum = parseInt(age);
    return ageNum >= 18 && ageNum <= 100;
  };
  
  export const validateBudgetRange = (min: string, max: string): boolean => {
    if (!min || !max) return true; // Optional fields
    return parseInt(min) <= parseInt(max);
  };
  
  export const validateUrl = (url: string, platform?: string): boolean => {
    if (!url) return true; // Empty is okay
    
    try {
      const urlObj = new URL(url);
      
      if (platform === "instagram") {
        return urlObj.hostname.includes("instagram.com");
      }
      if (platform === "linkedin") {
        return urlObj.hostname.includes("linkedin.com");
      }
      
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };
  
  export const formatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 10);
  };
  
  export const formatBudget = (value: string): string => {
    return value.replace(/\D/g, "");
  };
  
  export const normalizeEmail = (email: string): string => {
    return email.toLowerCase().trim();
  };