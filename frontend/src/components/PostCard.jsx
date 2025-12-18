import { useState, useEffect } from "react";
import {
  Calendar,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

function PostCard({ post }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch presigned URLs for before/after images
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

  return (
    <div
      className="border rounded-xl p-6 md:p-8 bg-white
      shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold mb-2">
        {post.issue_title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-6">
        {post.issue_description}
      </p>

      {/* Top details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            <strong>Issue:</strong>{" "}
            {new Date(post.issue_date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            <strong>Resolved:</strong>{" "}
            {new Date(post.updated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>
            <strong>Department:</strong> {post.department}
          </span>
        </div>
      </div>

      {/* BEFORE + AFTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div>
          <div className="flex items-center gap-2 mb-2 font-medium">
            <ImageIcon className="w-4 h-4" />
            Before
          </div>

          <div
            className="border rounded-lg overflow-hidden
            aspect-[4/3] w-full bg-gray-100
            flex items-center justify-center
            cursor-pointer hover:ring-2 hover:ring-black/20 transition"
            onClick={() => beforeImage && setPreviewImage(beforeImage)}
          >
            {loadingImages ? (
              <span className="text-gray-400 text-sm">Loading…</span>
            ) : beforeImage ? (
              <img
                src={beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image</span>
            )}
          </div>
        </div>

        {/* AFTER */}
        <div>
          <p className="font-semibold mb-2">After</p>

          <div
            className="border rounded-lg overflow-hidden
            aspect-[4/3] w-full bg-gray-100
            flex items-center justify-center
            cursor-pointer hover:ring-2 hover:ring-black/20 transition"
            onClick={() => afterImage && setPreviewImage(afterImage)}
          >
            {loadingImages ? (
              <span className="text-gray-400 text-sm">Loading…</span>
            ) : afterImage ? (
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                No after image
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm
          flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="w-[80vw] max-w-4xl aspect-[4/3]
            bg-black flex items-center justify-center
            rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
