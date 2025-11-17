"use client";
import React, { useState, useEffect } from "react";
import { Search, User, Home, Compass, Users, LogIn, LogOut } from "lucide-react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("homes");
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  // Redirect to sign-in on pressing ENTER
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      window.location.href = "/sign-in";
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Header height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "homes") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "experiences") {
      scrollToSection("experiences");
    }
  };

  return (
    <div>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg border-b border-amber-200"
            : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => handleTabClick("homes")}
            >
              <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                findmate.com
              </span>
            </div>

            {/* Center nav */}
            <div className="hidden md:flex items-center space-x-8 transition-opacity duration-300">
              <button
                onClick={() => handleTabClick("homes")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                  activeTab === "homes"
                    ? "text-amber-700 bg-amber-50 shadow-md"
                    : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Homes</span>
              </button>

              <button
                onClick={() => handleTabClick("experiences")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                  activeTab === "experiences"
                    ? "text-amber-700 bg-amber-50 shadow-md"
                    : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                } ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              >
                <Compass className="w-4 h-4" />
                <span className="font-medium">Experiences</span>
                <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-full">
                  NEW
                </span>
              </button>
            </div>

            {/* Search bar when scrolled */}
            <div
              className={`hidden md:flex transition-all duration-300 ${
                isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-white border border-gray-300 rounded-full shadow-lg p-1">
                <div className="flex items-center">
                  <div className="px-4 py-1">
                    <input
                      type="text"
                      placeholder="Enter city, area or landmark"
                      onKeyDown={handleEnter}
                      className="w-48 text-sm text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                    />
                  </div>

                  <div className="px-1">
                    <button className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-2 rounded-full hover:from-amber-700 hover:to-orange-800 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side auth */}
            <div className="flex items-center space-x-3">
              {!mounted ? (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center animate-pulse">
                  <User className="w-5 h-5 text-white" />
                </div>
              ) : isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.firstName || "User"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {user?.firstName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>

                  <SignOutButton>
                    <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-full transition">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:block">Sign Out</span>
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-full hover:from-amber-700 hover:to-orange-800 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>

        {/* Full search bar when not scrolled */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 pb-4">
            <div className="bg-white border border-gray-300 rounded-full shadow-lg p-2">
              <div className="flex items-center">
                <div className="flex-1 px-6 py-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city, area or landmark"
                    onKeyDown={handleEnter}
                    className="w-full text-sm text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                  />
                </div>

                <div className="px-2">
                  <button className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-3 rounded-full hover:from-amber-700 hover:to-orange-800 transition shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;