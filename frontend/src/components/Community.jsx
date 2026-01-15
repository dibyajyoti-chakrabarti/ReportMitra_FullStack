import React, { useEffect, useState, useRef } from "react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import PostCard from "./PostCard";
import { Loader2, Users } from "lucide-react";

function Community() {
  const [posts, setPosts] = useState([]);
  const [nextCursorUrl, setNextCursorUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const observerRef = useRef(null);

  // API base (env-safe)
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchPosts = async (
    url = `${API_BASE}/api/reports/community/resolved/`,
    isInitial = false
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(url);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON, got:", text);
        setLoading(false);
        if (isInitial) setInitialLoading(false);
        return;
      }

      const data = await res.json();

      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.results.filter(p => !existingIds.has(p.id));
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

  // Initial load
  useEffect(() => {
    fetchPosts(undefined, true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !nextCursorUrl) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchPosts(nextCursorUrl);
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [nextCursorUrl]);

  // Show loading screen during initial fetch (NO Navbar/Footer)
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700">
        <Loader2 className="h-14 w-14 animate-spin text-gray-900" />
        <p className="text-lg font-semibold tracking-wide">
          Loading community updates
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">
        <div
          className="bg-white w-full max-w-6xl rounded-2xl shadow-md
          px-4 sm:px-6 md:px-10 py-6 md:py-8"
        >
          <h1 className="text-3xl md:text-4xl text-center font-bold mb-8">
            Community Updates
          </h1>

          <div className="space-y-10">
            {posts.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Updates Yet
                </h3>
                <p className="text-gray-500 max-w-md">
                  The community page will show resolved issues and their impact. Check back soon to see how your reports are making a difference.
                </p>
              </div>
            )}

            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}

            <div ref={observerRef} />

            {loading && (
              <div className="text-center text-gray-500 py-6">
                Loading more updates…
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Community;