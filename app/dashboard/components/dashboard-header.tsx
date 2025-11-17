"use client";
import React, { useState } from 'react';
import { ChevronDown, MessageSquare, User, LogOut, Users, Plus, Loader2 } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';

// Notification dropdown (already added)
import NotificationsDropdown from "./notifications-dropdown";

export default function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            findmate.com
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Notifications Dropdown */}
          <NotificationsDropdown />

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg"
            >
              <img
                src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                alt="User"
                className="w-9 h-9 rounded-full"
              />
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.emailAddresses[0]?.emailAddress}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">

                {/* Account Profile */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/dashboard/profile';
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Account Profile</span>
                </button>

                {/* My Posts */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/dashboard/my-posts';
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">My Posts</span>
                </button>

                {/* Room Buddies */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/dashboard/room-buddies';
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Room Buddies</span>
                </button>

                {/* Messages */}
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Messages</span>
                </button>

                <hr className="my-2" />

                {/* Logout with Loader */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}