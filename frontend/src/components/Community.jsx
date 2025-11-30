// src/components/Community.jsx
import React from "react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import PostCard from "./PostCard"; // make sure this file exists and exports default
import report_bg from "../assets/reportbg.jpg"; // optional; use same bg used elsewhere
import before1 from "../assets/analysisicon.png"
import after1 from "../assets/communityicon.jpg"

const samplePosts = [
  {
    id: 1,
    title: "Broken Street Light at Dholakpur",
    description: "Street light at junction near market not working for 2 weeks.",
    issueDate: "2025-10-01",
    solutionDate: "2025-10-05",
    department: "Electrical",
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
      <main className="flex-grow relative flex justify-center py-8 md:py-12 lg:py-16">
        <img
          src={report_bg}
          alt="background pattern"
          className="absolute inset-0 object-cover w-full h-full -z-10"
        />

        {/* white container - not rounded as you asked earlier */}
        <div className="relative bg-white w-[92vw] md:w-[84vw] lg:w-[75vw] shadow-lg z-10 px-6 md:px-12 py-10">
          <h1 className="text-4xl md:text-5xl text-center font-extrabold mb-8">
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
