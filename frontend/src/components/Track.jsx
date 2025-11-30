import Navbar from "./MiniNavbar";
import report_bg from "../assets/reportbg.jpg";
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
    <main className="flex-grow relative flex justify-center py-8 md:py-12 lg:py-16">
      
      {/* Background image behind main */}
      <img
        src={report_bg}
        alt=""
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />

      {/* White Container */}
      <div
        className={`relative bg-white w-[90vw] md:w-[80vw] lg:w-[75vw]  shadow-lg z-10
                    px-4 md:px-10 py-8 transition-all duration-300 ease-out
                    ${reportData ? "min-h-[60vh]" : "min-h-[18vh]"}`}
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
        <div className="flex flex-col sm:flex-row justify-center items-center text-base sm:text-xl font-semibold gap-2 sm:gap-3">
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
              className="border px-2 py-1 text-gray-700 w-40 sm:w-52 md:w-60 rounded"
            />

            <button
              onClick={handleCheckReport}
              className="text-sm sm:text-base bg-black text-white px-3 py-1 sm:py-2 rounded-3xl cursor-pointer ml-2 hover:scale-105 transition"
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
              <div className="border-2 rounded-4xl p-1 flex flex-wrap justify-center">

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
