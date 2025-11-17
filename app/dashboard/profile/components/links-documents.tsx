"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FileText, Loader2 } from "lucide-react";
import { UPLOAD_BUTTON_APPEARANCE } from "./basic-info";
import toast from "react-hot-toast";

interface Step3Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const INPUT_CLASS = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent";
const MAX_DOCUMENTS = 3;

export default function LinksDocuments({ formData, updateFormData }: Step3Props) {
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  const isValidUrl = (url: string, platform: string): boolean => {
    if (!url) return true;
    
    try {
      const urlObj = new URL(url);
      
      if (platform === "instagram") {
        return urlObj.hostname.includes("instagram.com");
      }
      if (platform === "linkedin") {
        return urlObj.hostname.includes("linkedin.com");
      }
      
      return true;
    } catch {
      return false;
    }
  };
  
  const updateSocialLink = (platform: string, value: string) => {
    const links = formData.socialLinks || [];
    const existingIndex = links.findIndex((link: string) => 
      link.toLowerCase().includes(platform.toLowerCase())
    );
    
    if (value.trim() && !isValidUrl(value, platform)) {
      toast.error(`Please enter a valid ${platform} URL`);
      return;
    }
    
    if (value.trim()) {
      if (existingIndex >= 0) {
        links[existingIndex] = value;
      } else {
        links.push(value);
      }
    } else {
      if (existingIndex >= 0) {
        links.splice(existingIndex, 1);
      }
    }
    
    updateFormData({ socialLinks: links });
  };

  const getSocialLink = (platform: string) => {
    const links = formData.socialLinks || [];
    return links.find((link: string) => link.toLowerCase().includes(platform.toLowerCase())) || "";
  };

  const removeDocument = (index: number) => {
    const currentDocs = formData.documents || [];
    updateFormData({
      documents: currentDocs.filter((_: any, i: number) => i !== index)
    });
    toast.success("Document removed");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Links & Documents</h2>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FaInstagram className="w-5 h-5 text-pink-600" />
          Instagram Profile
        </label>
        <input
          type="url"
          value={getSocialLink("instagram")}
          onChange={(e) => updateSocialLink("instagram", e.target.value)}
          onBlur={(e) => {
            if (e.target.value && !isValidUrl(e.target.value, "instagram")) {
              toast.error("Please enter a valid Instagram URL (e.g., https://instagram.com/username)");
            }
          }}
          className={INPUT_CLASS}
          placeholder="https://instagram.com/yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">
          Example: https://instagram.com/yourprofile
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FaLinkedin className="w-5 h-5 text-blue-600" />
          LinkedIn Profile
        </label>
        <input
          type="url"
          value={getSocialLink("linkedin")}
          onChange={(e) => updateSocialLink("linkedin", e.target.value)}
          onBlur={(e) => {
            if (e.target.value && !isValidUrl(e.target.value, "linkedin")) {
              toast.error("Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)");
            }
          }}
          className={INPUT_CLASS}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <p className="text-xs text-gray-500 mt-1">
          Example: https://linkedin.com/in/yourprofile
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documents (Resume, Achievements, ID Proof - Max {MAX_DOCUMENTS})
        </label>
        
        {(!formData.documents || formData.documents.length < MAX_DOCUMENTS) && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {uploadingDoc ? (
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                ) : (
                  <FileText className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="text-center">
                {uploadingDoc ? (
                  <p className="text-sm text-orange-600 font-medium">Uploading document...</p>
                ) : (
                  <>
                    <UploadButton<OurFileRouter, "documents">
                      endpoint="documents"
                      onBeforeUploadBegin={(files: File[]) => {
                        setUploadingDoc(true);
                        return files;
                        setUploadingDoc(true);
                      }}
                      onClientUploadComplete={(res) => {
                        setUploadingDoc(false);
                        if (res?.[0]?.url) {
                          const currentDocs = formData.documents || [];
                          updateFormData({
                            documents: [...currentDocs, res[0].url]
                          });
                          toast.success("Document uploaded successfully!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setUploadingDoc(false);
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      appearance={UPLOAD_BUTTON_APPEARANCE}
                    />
                    <p className="text-xs text-gray-500 mt-2">PDFs up to 16MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {formData.documents && formData.documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.documents.map((doc: string, index: number) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                
                  <a href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate flex-1 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  Document {index + 1}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to remove this document?")) {
                      removeDocument(index);
                    }
                  }}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {formData.documents.length} / {MAX_DOCUMENTS} documents uploaded
              </p>
              {formData.documents.length >= MAX_DOCUMENTS && (
                <p className="text-xs text-orange-600 font-medium">
                  Maximum documents uploaded
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}