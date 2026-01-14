import { useState, useEffect } from "react";
import {
  Calendar,
  Building2,
  Image as ImageIcon,
  ImageOff,
} from "lucide-react";

function PostCard({ post }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
    <article className="border rounded-xl bg-white shadow-sm hover:shadow-md transition p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-2 break-words line-clamp-2">
        {post.issue_title}
      </h2>

      <p className="text-gray-600 leading-relaxed mb-6 break-all line-clamp-4">
        {post.issue_description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm text-gray-700 border-t pt-4">
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

        <div className="flex items-center gap-2 break-words line-clamp-1">
          <Building2 className="w-4 h-4 shrink-0" />
          <span>
            <strong>Department:</strong> {post.department}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageBox
          title="Before"
          image={beforeImage}
          loading={loadingImages}
          onError={() => setBeforeImage(null)}
          onPreview={setPreviewImage}
        />

        <ImageBox
          title="After"
          image={afterImage}
          loading={loadingImages}
          onError={() => setAfterImage(null)}
          onPreview={setPreviewImage}
        />
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm
          flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="w-[80vw] max-w-4xl aspect-[4/3]
            bg-black rounded-xl overflow-hidden"
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
    </article>
  );
}

function ImageBox({ title, image, loading, onError, onPreview }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 font-medium">
        <ImageIcon className="w-4 h-4" />
        {title}
      </div>

      <div
        className="border rounded-lg aspect-[4/3] w-full bg-gray-100
        flex items-center justify-center cursor-pointer
        hover:ring-2 hover:ring-black/20 transition"
        onClick={() => image && onPreview(image)}
      >
        {loading ? (
          <span className="text-gray-400 text-sm">Loading…</span>
        ) : image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={onError}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 text-sm">
            <ImageOff className="w-8 h-8 mb-1" />
            Image unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
