import { useState } from "react";
import {
  Calendar,
  Building2,
  Image as ImageIcon,
  ArrowRight
} from "lucide-react";


function PostCard({ post }) {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div className="border rounded-xl p-6 md:p-8 bg-white
shadow-sm hover:shadow-md transition-shadow">

      <h2 className="text-xl md:text-2xl font-semibold mb-2">
  {post.title}
</h2>

<p className="text-gray-600 leading-relaxed mb-6">
  {post.description}
</p>


      {/* Top details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm text-gray-700">
  <div className="flex items-center gap-2">
    <Calendar className="w-4 h-4" />
    <span><strong>Issue:</strong> {post.issueDate}</span>
  </div>

  <div className="flex items-center gap-2">
    <Calendar className="w-4 h-4" />
    <span><strong>Resolved:</strong> {post.solutionDate}</span>
  </div>

  <div className="flex items-center gap-2">
    <Building2 className="w-4 h-4" />
    <span><strong>Department:</strong> {post.department}</span>
  </div>
</div>


      {/* BEFORE + AFTER row (horizontal always) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BEFORE BOX */}
        <div className="flex-1">
<div className="flex items-center gap-2 mb-2 font-medium">
  <ImageIcon className="w-4 h-4" />
  Before
</div>
          <div className="border rounded-lg overflow-hidden cursor-pointer
  hover:ring-2 hover:ring-black/20 transition
  aspect-[4/3] w-full bg-gray-100 flex items-center justify-center"
               onClick={() => setPreviewImage(post.beforeImage)}>
            
            <img
  src={post.beforeImage}
  alt="Before"
  className="w-full h-full object-cover"
/>

          </div>
        </div>

        {/* AFTER BOX */}
        <div className="flex-1">
          <p className="font-semibold mb-2">After</p>
          <div className="border rounded-lg overflow-hidden cursor-pointer
  hover:ring-2 hover:ring-black/20 transition
  aspect-[4/3] w-full bg-gray-100 flex items-center justify-center"
               onClick={() => setPreviewImage(post.afterImage)}>
            
            <img
  src={post.afterImage}
  alt="Before"
  className="w-full h-full object-cover"
/>
</div>
        </div>

      </div>

      {/* FULLSCREEN PREVIEW WITHOUT CLOSE BUTTON */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm
flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
  className="w-[80vw] max-w-4xl aspect-[4/3]
  bg-black flex items-center justify-center rounded-xl overflow-hidden"
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
