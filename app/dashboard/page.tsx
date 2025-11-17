"use client";
import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Users, MapPin, IndianRupee, Eye } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import SendRequestButton from "./components/send-request-button";

interface Post {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  budgetMin: number;
  budgetMax: number;
  currentAddress: string;
  additionalDetails: string;
  profilePhoto: string | null;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { user } = useUser();

  // Load current user's database ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  // ✅ FIXED: Load user-specific search results from sessionStorage
  useEffect(() => {
    if (!user?.id) return; // Wait for user to be loaded

    // Create user-specific key
    const storageKey = `searchResults_${user.id}`;
    const stored = sessionStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const { posts: storedPosts, timestamp, query } = JSON.parse(stored);
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
        
        // Check if data is less than 10 minutes old
        if (Date.now() - timestamp < tenMinutes) {
          setPosts(storedPosts);
          setHasSearched(true);
          setSearchQuery(query || "");
          console.log(`✅ Loaded search results for user ${user.id} (still valid)`);
        } else {
          // Data expired, clear it
          sessionStorage.removeItem(storageKey);
          console.log("⏰ Search results expired (>10 min)");
        }
      } catch (error) {
        console.error("Error loading stored results:", error);
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [user?.id]); // Re-run when user changes

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    if (!user?.id) {
      toast.error("Please wait, loading user data...");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      params.append("city", searchQuery);

      if (budgetMin) params.append("budgetMin", budgetMin);
      if (budgetMax) params.append("budgetMax", budgetMax);
      if (genderFilter) params.append("gender", genderFilter);

      const response = await fetch(`/api/posts/search?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setPosts(data);

        // ✅ FIXED: Store in user-specific sessionStorage key
        const storageKey = `searchResults_${user.id}`;
        sessionStorage.setItem(storageKey, JSON.stringify({
          posts: data,
          timestamp: Date.now(),
          query: searchQuery
        }));

        if (data.length === 0) {
          toast.error("No roommates found in this city");
        } else {
          toast.success(`Found ${data.length} roommate(s)!`);
        }
      } else {
        toast.error("Failed to search");
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName || "there"}! 👋
            </h1>
            <p className="text-gray-600">
              Start your search to find the perfect roommate
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Search Box */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by City"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                  text-gray-700"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 border-2 rounded-lg font-medium transition-all ${
                  showFilters
                    ? "bg-orange-50 border-orange-500 text-orange-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Min Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="15000"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gender Preference
                    </label>
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {!hasSearched ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="max-w-xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Find Your Perfect Roommate! ✨
                </h2>
                <p className="text-gray-600 mb-8">
                  Start your search by entering a city name above.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {posts.length} Roommate{posts.length !== 1 ? "s" : ""} Found
              </h2>

              {posts.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No roommates found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
                    >
                      <div className="flex p-5">

                        <div className="flex-shrink-0 mr-5">
                          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                            {post.profilePhoto ? (
                              <img
                                src={post.profilePhoto}
                                alt={post.name}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                            ) : (
                              <Users className="w-12 h-12" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {post.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {post.city}, {post.state}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Rent</p>
                              <p className="text-sm font-semibold text-gray-900 flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {post.budgetMin}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Looking for</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {post.gender}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Property</p>
                              <p className="text-sm font-semibold text-gray-900">Room</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Address</p>
                            <p className="text-sm text-gray-700 line-clamp-1">
                              {post.currentAddress}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-3 border-t border-gray-100">

                            <button
                              onClick={() => window.location.href = `/dashboard/profile-view/${post.id}`}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </button>

                            <SendRequestButton
                              postId={post.id}
                              postUserId={post.userId}
                              postOwnerName={post.name}
                              currentUserId={currentUserId}
                            />

                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}