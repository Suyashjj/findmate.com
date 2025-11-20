"use client";
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { ChevronDown, MessageSquare, User, LogOut, Users, Plus, Loader2 } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load notifications dropdown - only loads when needed
const NotificationsDropdown = dynamic(() => import('./notifications-dropdown'), {
  loading: () => <div className="w-6 h-6 animate-pulse bg-gray-200 rounded" />,
  ssr: false
});

// Default avatar constant - prevents recreation on each render
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=User";

// Navigation items constant - prevents recreation
const NAV_ITEMS = [
  { href: '/dashboard/profile', icon: User, label: 'Account Profile' },
  { href: '/dashboard/my-posts', icon: Plus, label: 'My Posts' },
  { href: '/dashboard/room-buddies', icon: Users, label: 'Room Buddies' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' }
] as const;

function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const { user } = useUser();
  const { signOut } = useClerk();

  // Memoized logout handler - prevents recreation on each render
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }, [signOut]);

  // Memoized toggle handler
  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  // Memoized close handler
  const closeMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  // Click outside handler - improves UX and prevents memory leaks
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu, closeMenu]);

  // Memoized user display info
  const userDisplayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
  const userEmail = user?.emailAddresses[0]?.emailAddress || '';
  const userAvatar = user?.imageUrl || DEFAULT_AVATAR;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between">

        {/* Logo - Using Link for better Next.js optimization */}
        <Link 
          href="/dashboard"
          className="flex items-center space-x-2 cursor-pointer group"
          aria-label="Go to dashboard home"
        >
          <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            findmate.com
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Notifications Dropdown - Lazy loaded */}
          <NotificationsDropdown />

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleUserMenu}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <img
                src={userAvatar}
                alt={`${userDisplayName} avatar`}
                className="w-9 h-9 rounded-full object-cover"
                loading="lazy"
              />
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {userDisplayName}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                  {userEmail}
                </div>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {showUserMenu && (
              <div 
                ref={menuRef}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                role="menu"
                aria-orientation="vertical"
              >

                {/* Navigation Items - Using Link for prefetching */}
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    role="menuitem"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm">{label}</span>
                  </Link>
                ))}

                <hr className="my-2" role="separator" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  role="menuitem"
                  aria-label={isLoggingOut ? 'Logging out' : 'Logout'}
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <LogOut className="w-4 h-4" aria-hidden="true" />
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
// Memoize entire component to prevent unnecessary re-renders
export default memo(DashboardHeader);