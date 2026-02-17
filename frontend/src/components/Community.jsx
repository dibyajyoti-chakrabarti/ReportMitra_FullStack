import React, { useEffect, useState, useRef } from "react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import PostCard from "./PostCard";
import { Loader2, Users, Sparkles } from "lucide-react";
import CommunityEmptyIllustration from "../assets/empty-illustration.png";
import PostDetailsModal from "./PostDetailsModal";

function Community() {
  const [posts, setPosts] = useState([]);
  const [nextCursorUrl, setNextCursorUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // State for the modal
  const [selectedPost, setSelectedPost] = useState(null);
  
  const observerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchPosts = async (
    url = `${API_BASE}/api/reports/community/resolved/`,
    isInitial = false
  ) => {
    if (loading) return;
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const res = await fetch(url, { headers });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON, got:", text);
        setLoading(false);
        if (isInitial) setInitialLoading(false);
        return;
      }

      const data = await res.json();

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = data.results.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });

      setNextCursorUrl(data.next);
    } catch (err) {
      console.error("Failed to fetch community posts:", err);
    } finally {
      setLoading(false);
      if (isInitial) setInitialLoading(false);
    }
  };

  // Handle synchronous updates from PostCard interactions
  // Updated to include interaction states
  const handleLikeUpdate = (postId, newLikesCount, newIsLiked) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes_count: newLikesCount,
              is_liked: newIsLiked !== undefined ? newIsLiked : post.is_liked
            }
          : post
      )
    );
    
    // Also update the selected post if it's open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ 
        ...prev, 
        likes_count: newLikesCount,
        is_liked: newIsLiked !== undefined ? newIsLiked : prev.is_liked
      }));
    }
  };

  const handleDislikeUpdate = (postId, newDislikesCount, newIsDisliked) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              dislikes_count: newDislikesCount,
              is_disliked: newIsDisliked !== undefined ? newIsDisliked : post.is_disliked
            }
          : post
      )
    );
    
    // Also update the selected post if it's open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ 
        ...prev, 
        dislikes_count: newDislikesCount,
        is_disliked: newIsDisliked !== undefined ? newIsDisliked : prev.is_disliked
      }));
    }
  };

  // Handle updates from modal - now includes interaction states
  const handleModalInteractionUpdate = (postId, newLikesCount, newDislikesCount, newIsLiked, newIsDisliked) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes_count: newLikesCount,
              dislikes_count: newDislikesCount,
              is_liked: newIsLiked !== undefined ? newIsLiked : post.is_liked,
              is_disliked: newIsDisliked !== undefined ? newIsDisliked : post.is_disliked
            }
          : post
      )
    );
    
    // Update the selected post to keep modal in sync
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        likes_count: newLikesCount,
        dislikes_count: newDislikesCount,
        is_liked: newIsLiked !== undefined ? newIsLiked : prev.is_liked,
        is_disliked: newIsDisliked !== undefined ? newIsDisliked : prev.is_disliked
      }));
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(undefined, true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !nextCursorUrl) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts(nextCursorUrl);
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [nextCursorUrl]);

  // Show loading screen during initial fetch
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700 bg-gradient-to-b from-emerald-50 to-white">
        <Loader2 className="h-14 w-14 animate-spin text-emerald-600" />
        <p className="text-lg font-semibold tracking-wide">
          Loading community updates...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 px-6 md:px-10 py-8 md:py-12 text-white">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  Success Stories
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-3">
                  Community Updates
                </h1>
                <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto">
                  See how your fellow citizens are making a real difference in our
                  community
                </p>
              </div>
            </div>

            <div className="px-6 md:px-10 py-8 md:py-10">
              {posts.length === 0 && !loading ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <img
                      src={CommunityEmptyIllustration}
                      alt="No community updates yet"
                      className="w-72 h-72 mx-auto mb-8 object-contain opacity-90"
                    />
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      No Updates Yet
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      The community page will showcase resolved issues and their
                      impact. Check back soon to see how your reports are making a
                      difference!
                    </p>
                    <a
                      href="/report"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Users className="w-5 h-5" />
                      Report an Issue
                    </a>
                  </div>
                </div>
              ) : (
                /* Posts List */
                <div>
                  {/* Stats Banner */}
                  {posts.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 mb-8">
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <div className="text-3xl font-black text-emerald-600">
                            {posts.length}+
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            Issues Resolved
                          </div>
                        </div>
                        <div className="w-px h-12 bg-emerald-300"></div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-emerald-600">
                            <Users className="w-8 h-8 mx-auto" />
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            Community Impact
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Posts Grid */}
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <div 
                        key={post.id} 
                        onClick={() => setSelectedPost(post)}
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                      >
                        <PostCard 
                          post={post}
                          onLikeUpdate={handleLikeUpdate}
                          onDislikeUpdate={handleDislikeUpdate}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Infinite Scroll Trigger */}
                  <div ref={observerRef} className="h-4" />

                  {/* Loading More Indicator */}
                  {loading && (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        Loading more updates...
                      </p>
                    </div>
                  )}

                  {/* End of Content */}
                  {!nextCursorUrl && posts.length > 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm font-medium">
                      🎉 You've seen all community updates!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Render Modal */}
      {selectedPost && (
        <PostDetailsModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onInteractionUpdate={handleModalInteractionUpdate}
        />
      )}
    </div>
  );
}

export default Community;