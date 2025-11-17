"use client";

import Link from "next/link";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Show footer only on homepage AND dashboard pages
  if (pathname !== "/" && !pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-white text-black py-6 sm:py-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Mobile View */}
        <div className="sm:hidden flex flex-col items-center gap-6">

          {/* Branding */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                findmate.com
              </span>
            </h3>
            <p className="text-sm text-gray-600 max-w-[220px]">
              Find compatible, like-minded roommates effortlessly
            </p>
          </div>

          {/* Social Media */}
          <div className="flex gap-6">
            <a
              href="https://x.com/SuyashJain32315?s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <FaTwitter className="text-black hover:text-orange-700 w-5 h-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/suyash-jain-719293335"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <FaLinkedin className="text-black hover:text-orange-700 w-5 h-5" />
            </a>

            <a
              href="https://github.com/Suyashjj"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <FaGithub className="text-black hover:text-orange-700 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Column 1: Branding */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                findmate.com
              </span>
            </h3>
            <p className="text-sm text-gray-600 text-center md:text-left max-w-[220px]">
              Find compatible, like-minded roommates effortlessly
            </p>
          </div>

          {/* Column 2: Explore (UI Only) */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3 text-amber-700">Explore</h4>

            <p className="text-black hover:text-orange-700 transition-colors mb-2 cursor-pointer">
              Pricing
            </p>
            <p className="text-black hover:text-orange-700 transition-colors mb-2 cursor-pointer">
              Your Matches
            </p>
            <p className="text-black hover:text-orange-700 transition-colors mb-2 cursor-pointer">
              About
            </p>
            <p className="text-black hover:text-orange-700 transition-colors cursor-pointer">
              Contact
            </p>
          </div>

          {/* Column 3: Support (UI Only) */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-3 text-amber-700">Support</h4>

            <p className="text-black hover:text-orange-700 transition-colors mb-2 cursor-pointer">
              Help
            </p>
            <p className="text-black hover:text-orange-700 transition-colors mb-2 cursor-pointer">
              FAQ
            </p>
            <p className="text-black hover:text-orange-700 transition-colors cursor-pointer">
              Terms of Service
            </p>
          </div>

          {/* Column 4: CTA + Social */}
          <div className="flex flex-col items-center md:items-start">
            <p
              className="inline-block bg-gradient-to-r from-amber-700 to-orange-700 text-white px-4 py-2 rounded-full mb-4 cursor-pointer hover:opacity-90 transition-colors"
            >
              Follow Us On
            </p>

            <div className="flex space-x-4">
              <a
                href="https://x.com/SuyashJain32315?s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaTwitter className="text-black hover:text-orange-700 w-6 h-6" />
              </a>

              <a
                href="https://www.linkedin.com/in/suyashjain531/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaLinkedin className="text-black hover:text-orange-700 w-6 h-6" />
              </a>

              <a
                href="https://github.com/Suyashjj"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaGithub className="text-black hover:text-orange-700 w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200 pt-3 sm:pt-4">
        © {new Date().getFullYear()} findmate.com All rights reserved.
      </div>
    </footer>
  );
}
