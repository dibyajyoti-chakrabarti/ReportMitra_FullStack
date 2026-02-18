import { useState, useEffect } from "react";
import {
  Calendar,
  Building2,
  Image as ImageIcon,
  ImageOff,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MapPin
} from "lucide-react";

function PostCard({ post, onLikeUpdate, onDislikeUpdate }) {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);
  
  // Local state for optimistic updates
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [dislikes, setDislikes] = useState(post.dislikes_count || 0);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isDisliked, setIsDisliked] = useState(post.is_disliked || false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Sync with parent component updates - including interaction states
  useEffect(() => {
    setLikes(post.likes_count || 0);
    setDislikes(post.dislikes_count || 0);
    setIsLiked(post.is_liked || false);
    setIsDisliked(post.is_disliked || false);
  }, [post.likes_count, post.dislikes_count, post.is_liked, post.is_disliked]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(
          `${API_BASE}/api/reports/${post.id}/presign-get/`
        );
        const data = await res.json();
        setBeforeImage(data.before || null);
        setAfterImage(data.after || null);
      } catch (err) {
        console.error("Failed to load images:", err);
      } finally {
        setLoadingImages(false);
      }
    }

    fetchImages();
  }, [post.id]);

  const handleInteraction = async (e, type) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Please login to interact with posts!");
      return;
    }

    // Optimistic update
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevIsLiked = isLiked;
    const prevIsDisliked = isDisliked;

    let newIsLiked = isLiked;
    let newIsDisliked = isDisliked;

    if (type === 'like') {
      if (isLiked) {
        setLikes(p => p - 1);
        setIsLiked(false);
        newIsLiked = false;
      } else {
        setLikes(p => p + 1);
        setIsLiked(true);
        newIsLiked = true;
        if (isDisliked) {
          setDislikes(p => p - 1);
          setIsDisliked(false);
          newIsDisliked = false;
        }
      }
    } else {
      if (isDisliked) {
        setDislikes(p => p - 1);
        setIsDisliked(false);
        newIsDisliked = false;
      } else {
        setDislikes(p => p + 1);
        setIsDisliked(true);
        newIsDisliked = true;
        if (isLiked) {
          setLikes(p => p - 1);
          setIsLiked(false);
          newIsLiked = false;
        }
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/reports/${post.id}/${type}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error("Action failed");
      
      const data = await res.json();
      
      // Update with server data
      setLikes(data.likes_count);
      setDislikes(data.dislikes_count);
      
      // Update interaction states from server response
      // Assuming the backend returns is_liked and is_disliked
      if (data.hasOwnProperty('is_liked')) {
        setIsLiked(data.is_liked);
        newIsLiked = data.is_liked;
      }
      if (data.hasOwnProperty('is_disliked')) {
        setIsDisliked(data.is_disliked);
        newIsDisliked = data.is_disliked;
      }
      
      // Notify parent for synchronization across all cards and modal
      if (onLikeUpdate) onLikeUpdate(post.id, data.likes_count, newIsLiked);
      if (onDislikeUpdate) onDislikeUpdate(post.id, data.dislikes_count, newIsDisliked);
      
    } catch (err) {
      console.error(err);
      // Revert on error
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setIsLiked(prevIsLiked);
      setIsDisliked(prevIsDisliked);
      alert("Failed to update. Please try again.");
    }
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200">
      {/* Images Section - Instagram-style dual image (NO ZOOM/PREVIEW) */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="grid grid-cols-2 gap-0.5 aspect-[16/9]">
          <div className="relative overflow-hidden bg-black">
            {loadingImages ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : beforeImage ? (
              <img 
                src={beforeImage} 
                alt="Before" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-12 h-12 mb-2 opacity-30" />
                <span className="text-xs">No image</span>
              </div>
            )}
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              Before
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-black">
            {loadingImages ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : afterImage ? (
              <img 
                src={afterImage} 
                alt="After" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-12 h-12 mb-2 opacity-30" />
                <span className="text-xs">No image</span>
              </div>
            )}
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              After
            </div>
          </div>
        </div>
        
        {/* Resolved Badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/95 backdrop-blur-md text-green-600 rounded-full border-2 border-green-500 font-bold text-sm shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 fill-current" />
          Resolved
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {post.issue_title}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {post.issue_description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Reported</div>
              <div className="font-semibold text-gray-900 truncate">
                {new Date(post.issue_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Resolved</div>
              <div className="font-semibold text-gray-900 truncate">
                {new Date(post.updated_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Department</div>
              <div className="font-semibold text-gray-900 truncate">{post.department}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</div>
              <div className="font-semibold text-gray-900 truncate">{post.location || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Social Actions - Consistent Like/Dislike */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* LIKE Button */}
            <button 
              onClick={(e) => handleInteraction(e, 'like')}
              className="flex items-center gap-2 group/like transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${
                isLiked 
                  ? 'text-emerald-600 scale-110' 
                  : 'text-gray-400 group-hover/like:text-emerald-500 group-hover/like:scale-110'
              }`}>
                <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className={`font-semibold transition-colors ${
                isLiked ? 'text-emerald-600' : 'text-gray-600'
              }`}>
                {likes}
              </span>
            </button>

            {/* DISLIKE Button */}
            <button 
              onClick={(e) => handleInteraction(e, 'dislike')}
              className="flex items-center gap-2 group/dislike transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${
                isDisliked 
                  ? 'text-red-600 scale-110' 
                  : 'text-gray-400 group-hover/dislike:text-red-500 group-hover/dislike:scale-110'
              }`}>
                <ThumbsDown className={`w-6 h-6 ${isDisliked ? 'fill-current' : ''}`} />
              </div>
              <span className={`font-semibold transition-colors ${
                isDisliked ? 'text-red-600' : 'text-gray-600'
              }`}>
                {dislikes}
              </span>
            </button>

            {/* Comments */}
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold text-gray-600">{post.comments_count || 0}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Click to view details
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;