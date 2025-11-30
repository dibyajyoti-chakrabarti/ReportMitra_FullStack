import { useState } from "react";

function PostCard({ post }) {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div className="bg-white border border-gray-300 shadow-md p-6 mb-8 w-full">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>

      {/* Description */}
      <p className="text-gray-700 mb-4">{post.description}</p>

      {/* Top details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
        <div>
          <p className="font-semibold">Issue Date:</p>
          <p>{post.issueDate}</p>
        </div>

        <div>
          <p className="font-semibold">Solution Date:</p>
          <p>{post.solutionDate}</p>
        </div>

        <div>
          <p className="font-semibold">Department:</p>
          <p>{post.department}</p>
        </div>
      </div>

      {/* BEFORE + AFTER row (horizontal always) */}
      <div className="w-full flex flex-col md:flex-row justify-between gap-6 mt-4">

        {/* BEFORE BOX */}
        <div className="flex-1">
          <p className="font-semibold mb-2">Before</p>
          <div className="border border-gray-400 rounded-lg overflow-hidden cursor-pointer"
               onClick={() => setPreviewImage(post.beforeImage)}>
            
            <img
              src={post.beforeImage}
              alt="before"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* AFTER BOX */}
        <div className="flex-1">
          <p className="font-semibold mb-2">After</p>
          <div className="border border-gray-400 rounded-lg overflow-hidden cursor-pointer"
               onClick={() => setPreviewImage(post.afterImage)}>
            
            <img
              src={post.afterImage}
              alt="after"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

      </div>

      {/* FULLSCREEN PREVIEW WITHOUT CLOSE BUTTON */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default PostCard;
