import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
        // Navigate to details view
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
    <div>
      <Navbar />
      <div className="relative h-[100vh] flex justify-center">
        <img
          src={report_bg}
          alt=""
          className="absolute inset-0 z-0 object-cover w-full h-full"
        />
        <div className="relative bg-white h-full w-[80vw] pt-20 z-10">
          <div className="text-center font-extrabold text-5xl py-3">
            Track Progress
          </div>
          <div className="px-15">
            <b>
              <u>Note: </u>
            </b>
            Enter your Tracking ID below to view the details and current status
            of your submitted complaint. You can access any enquiry using its
            unique Tracking ID — no login required. Please ensure you enter the
            exact ID provided at the time of submission.
            <div className="my-4"></div>
            <hr />
            <div className="flex justify-center text-xl">
              <div className="flex gap-3 font-bold items-center my-1">
                Tracking ID:
                <div className="flex items-center">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID"
                    className="border px-2 text-gray-500 w-30"
                  />
                  <button 
                    onClick={handleCheckReport}
                    className="text-[15px] bg-black text-white px-2 py-2 rounded-3xl cursor-pointer ml-2 hover:scale-110"
                  >
                    CHECK
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center text-red-500 font-bold underline">
                {error}
              </div>
            )}

            {/* Report Found Message */}
            {reportData && (
              <div className="text-center text-green-600 underline font-bold my-2">
                Report found! View details below.
              </div>
            )}

            <hr />
            
            {/* Navigation Tabs - Only show if report is found */}
            {reportData && (
              <div>
                <nav className="flex gap-2 items-center justify-center font-bold my-2">
                  <div className="border-2 p-1 rounded-2xl">
                    <Link
                      to="details"
                      onClick={() => setActive("details")}
                      className={`px-2 py-1 ${
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
                      className={`px-2 py-1 ${
                        active === "action"
                          ? "bg-black text-white rounded-3xl"
                          : "bg-white text-black rounded-3xl"
                      }`}
                    >
                      Actions Taken
                    </Link>
                  </div>
                </nav>
                
                {/* Pass report data to child components */}
                <Outlet context={[reportData]} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Track;