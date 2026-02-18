import Navbar from "./MiniNavbar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import { BACKEND_BASE_URL } from "../config/backend";
import { Search, AlertCircle, CheckCircle, FileSearch } from "lucide-react";
import TrackingIllustration from "../assets/tracking-illustration2.png";

function Track() {
  const [active, setActive] = useState("details");
  const [trackingId, setTrackingId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleCheckReport = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a Tracking ID");
      return;
    }

    setIsSearching(true);
    setError("");
    const BACKEND_ROOT_URL = BACKEND_BASE_URL.replace(/\/api$/, "");

    try {
      const response = await fetch(
        `${BACKEND_ROOT_URL}/track/detail/${trackingId}/`
      );
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
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCheckReport();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 px-6 md:px-10 py-8 md:py-12 text-white">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-3">
                  Track Your Report
                </h1>
                <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto">
                  Monitor the progress of your submitted complaint in real-time
                </p>
              </div>
            </div>

            <div className="px-6 md:px-10 py-8">
              {/* Info Box */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-800">
                  <p className="font-semibold mb-1">How to track your report:</p>
                  <p>
                    Enter your unique Tracking ID below to view the details and
                    current status of your submitted complaint. You can access any
                    report using its Tracking ID — no login required.
                  </p>
                </div>
              </div>

              {/* Search Section */}
              <div className="max-w-3xl mx-auto mb-8">
                <label
                  htmlFor="trackID"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Enter Tracking ID
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="trackID"
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your Tracking ID (e.g., TRK123456)"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCheckReport}
                    disabled={isSearching}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {reportData && !error && (
                  <div className="mt-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">
                      Report found! View details below.
                    </span>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {!reportData && !error && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    {/* 
                      ILLUSTRATION NEEDED: Tracking/Search illustration
                      - Storyset.com > Business Illustrations > Simple Background
                      - Colors: Green tones (#10B981, #059669)
                      - Style: Person searching/tracking with magnifying glass
                      - Save as: tracking-illustration.png
                    */}
                    <img
                      src={TrackingIllustration}
                      alt="Track your report"
                      className="w-64 h-64 mx-auto mb-6 object-contain opacity-90"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ready to Track?
                    </h3>
                    <p className="text-gray-600">
                      Enter your Tracking ID above to view your report status and
                      progress updates.
                    </p>
                  </div>
                </div>
              )}

              {/* Report Data Section */}
              {reportData && (
                <div>
                  <hr className="my-8 border-gray-200" />

                  {/* Navigation Tabs */}
                  <nav className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1.5">
                      <Link
                        to="details"
                        onClick={() => setActive("details")}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                          active === "details"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        Issue Details
                      </Link>

                      <Link
                        to="action"
                        onClick={() => setActive("action")}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                          active === "action"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        Actions Taken
                      </Link>
                    </div>
                  </nav>

                  {/* Outlet for nested routes */}
                  <div>
                    <Outlet context={[reportData]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Track;