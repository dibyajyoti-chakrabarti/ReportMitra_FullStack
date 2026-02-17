import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ThumbsUp, ThumbsDown, MapPin, Building2, Calendar, User, Loader2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function PostDetailsModal({ post, onClose, onInteractionUpdate }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Local state for social interactions
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [dislikes, setDislikes] = useState(post.dislikes_count || 0);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked || false);

  const [images, setImages] = useState({ before: null, after: null });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const commentSectionRef = useRef(null);

  // Sync with parent prop updates - CRITICAL for consistency
  useEffect(() => {
    setLikes(post.likes_count || 0);
    setDislikes(post.dislikes_count || 0);
    setIsLiked(post.is_liked || false);
    setIsDisliked(post.is_disliked || false);
  }, [post.likes_count, post.dislikes_count, post.is_liked, post.is_disliked]);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const res = await fetch(`${API_BASE}/api/users/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch Images
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${API_BASE}/api/reports/${post.id}/presign-get/`);
        const data = await res.json();
        setImages({ before: data.before, after: data.after });
      } catch (err) {
        console.error("Failed to load images", err);
      }
    }
    fetchImages();
  }, [post.id]);

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('accessToken'); 
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch(`${API_BASE}/api/reports/${post.id}/comments/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  // Handle Like Interaction
  const handleLike = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please login to like posts!");
      return;
    }

    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevIsLiked = isLiked;
    const prevIsDisliked = isDisliked;

    let newIsLiked = isLiked;
    let newIsDisliked = isDisliked;

    // Optimistic update
    if (isLiked) {
      setLikes(p => p - 1);
      setIsLiked(false);
      newIsLiked = false;
    } else {
      setLikes(p => p + 1);
      setIsLiked(true);
      newIsLiked = true;
      // Remove dislike if exists
      if (isDisliked) {
        setDislikes(p => p - 1);
        setIsDisliked(false);
        newIsDisliked = false;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/reports/${post.id}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error("Like action failed");
      
      const data = await res.json();
      setLikes(data.likes_count);
      setDislikes(data.dislikes_count);
      
      // Update interaction states from server response
      if (data.hasOwnProperty('is_liked')) {
        setIsLiked(data.is_liked);
        newIsLiked = data.is_liked;
      }
      if (data.hasOwnProperty('is_disliked')) {
        setIsDisliked(data.is_disliked);
        newIsDisliked = data.is_disliked;
      }
      
      // Notify parent for synchronization
      if (onInteractionUpdate) {
        onInteractionUpdate(post.id, data.likes_count, data.dislikes_count, newIsLiked, newIsDisliked);
      }
      
    } catch (err) {
      console.error(err);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setIsLiked(prevIsLiked);
      setIsDisliked(prevIsDisliked);
      alert("Failed to update. Please try again.");
    }
  };

  // Handle Dislike Interaction
  const handleDislike = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please login to interact with posts!");
      return;
    }

    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevIsLiked = isLiked;
    const prevIsDisliked = isDisliked;

    let newIsLiked = isLiked;
    let newIsDisliked = isDisliked;

    // Optimistic update
    if (isDisliked) {
      setDislikes(p => p - 1);
      setIsDisliked(false);
      newIsDisliked = false;
    } else {
      setDislikes(p => p + 1);
      setIsDisliked(true);
      newIsDisliked = true;
      // Remove like if exists
      if (isLiked) {
        setLikes(p => p - 1);
        setIsLiked(false);
        newIsLiked = false;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/reports/${post.id}/dislike/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error("Dislike action failed");
      
      const data = await res.json();
      setLikes(data.likes_count);
      setDislikes(data.dislikes_count);
      
      // Update interaction states from server response
      if (data.hasOwnProperty('is_liked')) {
        setIsLiked(data.is_liked);
        newIsLiked = data.is_liked;
      }
      if (data.hasOwnProperty('is_disliked')) {
        setIsDisliked(data.is_disliked);
        newIsDisliked = data.is_disliked;
      }
      
      // Notify parent for synchronization
      if (onInteractionUpdate) {
        onInteractionUpdate(post.id, data.likes_count, data.dislikes_count, newIsLiked, newIsDisliked);
      }
      
    } catch (err) {
      console.error(err);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setIsLiked(prevIsLiked);
      setIsDisliked(prevIsDisliked);
      alert("Failed to update. Please try again.");
    }
  };

  // Submit Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) return alert("Please login to comment!");
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports/${post.id}/comments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newComment })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        setNewComment("");
        setTimeout(() => {
          if(commentSectionRef.current) {
            commentSectionRef.current.scrollTop = commentSectionRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper functions for user display
  const getUserDisplayName = (post) => {
    if (post.full_name) return post.full_name;
    if (post.first_name && post.last_name) return `${post.first_name} ${post.last_name}`.trim();
    if (post.username) return post.username;
    return null;
  };

  const getUserInitials = (post) => {
    const displayName = getUserDisplayName(post);
    if (!displayName) return 'U';
    const parts = displayName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  const imageArray = [images.before, images.after].filter(Boolean);
  const hasImages = imageArray.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Image Gallery - 60% width */}
        <div className="md:w-[60%] bg-black flex items-center justify-center relative">
          {hasImages ? (
            <>
              <img 
                src={imageArray[currentImageIndex]} 
                alt={currentImageIndex === 0 ? "Before" : "After"}
                className="w-full h-full object-contain max-h-[90vh]"
              />
              
              {/* Image Labels */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full font-bold text-sm shadow-lg">
                {currentImageIndex === 0 && images.before ? "Before" : "After"}
              </div>
              
              {/* Navigation Arrows (only if multiple images) */}
              {imageArray.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex - 1 + imageArray.length) % imageArray.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:shadow-2xl hover:scale-110"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex + 1) % imageArray.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl hover:shadow-2xl hover:scale-110"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-12">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No images available</p>
            </div>
          )}
        </div>

        {/* Right Side: Details & Interactions - 40% width */}
        <div className="md:w-[40%] flex flex-col bg-white">
          {/* Header with User Info */}
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-lg">
                {getUserInitials(post)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">
                {post.user_name || getUserDisplayName(post) || 'Community Member'}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {post.location || 'Unknown location'}
              </p>
            </div>
          </div>

          {/* Post Details */}
          <div className="flex-1 overflow-y-auto">
            {/* Issue Information */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {post.issue_title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                {post.issue_description}
              </p>
              
              {/* Metadata Chips */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5" />
                  {post.department}
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Resolved {new Date(post.updated_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                  })}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h3>
              </div>

              <div 
                className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                ref={commentSectionRef}
              >
                {loadingComments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const commentUserName = comment.full_name || 
                                           (comment.first_name && comment.last_name ? `${comment.first_name} ${comment.last_name}`.trim() : null) ||
                                           comment.username || 
                                           'Anonymous';
                    
                    const commentInitial = commentUserName[0].toUpperCase();
                    
                    return (
                      <div key={comment.id} className="flex gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="font-bold text-white text-xs">
                            {commentInitial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none group-hover:bg-gray-100 transition-colors">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-sm text-gray-900 truncate">
                                {commentUserName}
                              </span>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                {new Date(comment.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short"
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-snug break-words">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 bg-white border-t border-gray-100">
            {/* Like & Dislike Buttons */}
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-100">
              {/* LIKE Button */}
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 group transition-all"
              >
                <ThumbsUp 
                  className={`w-7 h-7 transition-all duration-300 ${
                    isLiked 
                      ? 'fill-emerald-600 text-emerald-600 scale-110' 
                      : 'text-gray-400 group-hover:text-emerald-500 group-hover:scale-110'
                  }`}
                />
                <span className={`font-bold text-lg transition-colors ${
                  isLiked ? 'text-emerald-600' : 'text-gray-700'
                }`}>
                  {likes}
                </span>
              </button>

              {/* DISLIKE Button */}
              <button 
                onClick={handleDislike}
                className="flex items-center gap-2 group transition-all"
              >
                <ThumbsDown 
                  className={`w-7 h-7 transition-all duration-300 ${
                    isDisliked 
                      ? 'fill-red-600 text-red-600 scale-110' 
                      : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
                  }`}
                />
                <span className={`font-bold text-lg transition-colors ${
                  isDisliked ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {dislikes}
                </span>
              </button>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm border border-gray-200 transition-all"
              />
              <button 
                type="submit" 
                disabled={submitting || !newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:bg-emerald-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}

export default PostDetailsModal;