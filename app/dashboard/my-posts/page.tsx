"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash2, MapPin, IndianRupee, Home, User } from "lucide-react";

interface Post {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  state: string;
  budgetMin: number;
  budgetMax: number;
  currentAddress: string;
  additionalDetails: string;
  foodPreference: string | null;
  smoking: boolean;
  drinking: boolean;
  profilePhoto: string | null;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        toast.error("Failed to load posts");
      }
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(postId);

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
              <p className="text-gray-600 mt-1">
                Manage your roommate requirements
              </p>
            </div>
          </div>

          {/* EMPTY STATE */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  No posts yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Create your first post to find the perfect roommate.
                </p>

                <button
                  onClick={() => router.push("/dashboard/post-requirement")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </button>
              </div>
            </div>
          ) : (
            /* POSTS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-5 flex gap-4">

                    {/* AVATAR */}
                    <div className="flex-shrink-0">
                      {post.profilePhoto ? (
                        <img
                          src={post.profilePhoto}
                          alt={post.name}
                          className="h-20 w-20 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-md bg-orange-100 flex items-center justify-center shadow-sm text-orange-700">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      {/* NAME + LOCATION */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.name}
                      </h3>
                      <p className="flex items-center text-sm text-gray-500 mt-0.5">
                        <MapPin className="w-4 h-4 mr-1" />
                        {post.city}, {post.state}
                      </p>

                      {/* DETAILS GRID */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Rent</p>
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1" />
                            {post.budgetMin}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Looking For</p>
                          <p className="text-sm font-medium text-gray-900">
                            {post.gender}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Property</p>
                          <p className="text-sm font-medium text-gray-900">
                            Room
                          </p>
                        </div>
                      </div>

                      {/* ADDRESS */}
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm text-gray-700 line-clamp-1">
                          {post.currentAddress}
                        </p>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => toast.error("Edit coming soon!")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === post.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
