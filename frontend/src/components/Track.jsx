import Navbar from "./MiniNavbar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from './Footer'

function Track() {
  const [active, setActive] = useState("details");
  const [trackingId, setTrackingId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckReport = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a Tracking ID");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/track/detail/${trackingId}/`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        setError("");
        navigate("details");
        setActive("details");
      } else {
        setError("Report not found. Please check your Tracking ID.");
        setReportData(null);
      }
    } catch (err) {
      setError("Error fetching report. Please try again.");
      setReportData(null);
    }
  };

  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* MAIN CONTENT (grows to fill screen when short) */}
<main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">

      {/* White Container */}
      <div
  className={`bg-white w-full max-w-6xl rounded-2xl shadow-md
  px-4 sm:px-6 md:px-10 py-6 md:py-8
  transition-all duration-300 ease-out
  ${reportData ? "min-h-[60vh]" : "min-h-[16vh]"}`}
>


        {/* Title */}
        <div className="text-center font-extrabold text-3xl sm:text-4xl md:text-5xl py-3">
          Track Progress
        </div>

        {/* Note */}
        <div className="text-sm sm:text-base leading-relaxed">
          <b>
            <u>Note:</u>
          </b>{" "}
          Enter your Tracking ID below to view the details and current status of your
          submitted complaint. You can access any enquiry using its unique Tracking ID —
          no login required. Please ensure you enter the exact ID provided at the time
          of submission.
        </div>

        <hr className="my-4" />

        {/* Tracking Input */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">

          <label htmlFor="trackID" className="font-bold">
            Tracking ID:
          </label>

          <div className="flex items-center">
            <input
              id="trackID"
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID"
className="border px-3 py-2 rounded-md text-gray-700
w-48 sm:w-56 md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleCheckReport}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm font-semibold
hover:bg-gray-900 transition"

            >
              CHECK
            </button>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="text-center text-red-600 font-bold underline mt-3">
            {error}
          </div>
        )}

        {/* Success */}
        {reportData && (
          <div className="text-center text-green-600 underline font-bold my-3">
            Report found! View details below.
          </div>
        )}

        <hr className="my-3" />

        {/* Tabs + Details */}
        {reportData && (
          <div>
            {/* Tabs */}
            <nav className="flex flex-wrap gap-2 items-center justify-center font-bold my-2">
<div className="border rounded-xl p-1 flex justify-center gap-1">

                <Link
                  to="details"
                  onClick={() => setActive("details")}
                  className={`px-3 py-1 sm:px-4 sm:py-2 m-1 ${
                    active === "details"
                      ? "bg-black text-white rounded-3xl"
                      : "bg-white text-black rounded-3xl"
                  }`}
                >
                  Issue Details
                </Link>

                <Link
                  to="action"
                  onClick={() => setActive("action")}
                  className={`px-3 py-1 sm:px-4 sm:py-2 m-1 ${
                    active === "action"
                      ? "bg-black text-white rounded-3xl"
                      : "bg-white text-black rounded-3xl"
                  }`}
                >
                  Actions Taken
                </Link>

              </div>
            </nav>

            {/* Tab Content */}
            <div className="overflow-x-auto md:mt-6">
              <Outlet context={[reportData]} />
            </div>
          </div>
        )}

      </div>
    </main>

    {/* FOOTER ALWAYS AT BOTTOM */}
    <Footer />
  </div>
);

}

export default Track;
