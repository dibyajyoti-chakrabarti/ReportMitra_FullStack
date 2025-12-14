// src/components/Community.jsx
import React from "react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import PostCard from "./PostCard";
import before1 from "../assets/before_sample.jpeg"
import after1 from "../assets/after_sample.jpeg"

const samplePosts = [
  {
    id: 1,
    title: "Pothole in Indranagar",
    description: "Pothole has caused several accidents. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta quam facilis cupiditate explicabo sunt adipisci, natus molestias blanditiis et dolor ipsum asperiores architecto dolorem reiciendis odio eos ipsam? Deleniti autem ipsam eaque consequatur est eos, error similique odio iste, aperiam, labore voluptatem. Repellat perspiciatis accusamus nulla voluptatem. Dolorum, atque possimus!",
    issueDate: "2025-10-01",
    solutionDate: "2025-10-05",
    department: "Road",
    // If you keep these in /public/assets, use absolute paths like below.
    // Or import the images at top and pass the imported variable instead.
    beforeImage: before1,
    afterImage: after1,
  },
];

function Community() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* main area - background only covers this main */}
<main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">

        {/* white container - not rounded as you asked earlier */}
<div className="bg-white w-full max-w-6xl rounded-2xl shadow-md
px-4 sm:px-6 md:px-10 py-6 md:py-8">
          <h1 className="text-3xl md:text-4xl text-center font-bold mb-8">
  Community Updates
</h1>


          {/* posts list */}
          <div className="space-y-10">
            {samplePosts.length === 0 ? (
              <div className="text-center text-gray-600 py-16">
                No posts yet — check back later.
              </div>
            ) : (
              samplePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Community;
