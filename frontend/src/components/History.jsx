import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import {
  Clipboard,
  Check,
  Loader2,
  FileText,
  Clock,
  MapPin,
  Send,
} from "lucide-react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import { getApiUrl } from "../utils/api";
import HistoryIllustration from "../assets/empty-illustration.png";

const History = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [appealingId, setAppealingId] = useState(null);

  const { getAuthHeaders, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const fetchHistory = async () => {
      try {
        const headers = await getAuthHeaders();
        if (import.meta.env.DEV) {
          console.log("HISTORY HEADERS:", headers);
        }

        const res = await fetch(getApiUrl("/reports/history/"), { headers });

        if (import.meta.env.DEV) {
          console.log("HISTORY STATUS:", res.status);
        }
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, isLoading]);

  const copyTrackingId = async (id) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 border-blue-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
    };

    return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const submitAppeal = async (reportId) => {
    try {
      setAppealingId(reportId);
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`/reports/${reportId}/appeal/`), {
        method: "POST",
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit appeal.");
      }

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === reportId
            ? { ...issue, appeal_status: "pending", can_appeal: false }
            : issue
        )
      );
    } catch (err) {
      alert(err.message || "Failed to submit appeal.");
    } finally {
      setAppealingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700 bg-gradient-to-b from-emerald-50 to-white">
        <Loader2 className="h-14 w-14 animate-spin text-emerald-600" />
        <p className="text-lg font-semibold tracking-wide">
          Loading your reports...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 px-6 md:px-10 py-8 md:py-12 text-white">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-3">
                  My Report History
                </h1>
                <p className="text-lg md:text-xl text-emerald-50">
                  Track all your submitted complaints in one place
                </p>
              </div>
            </div>

            <div className="px-6 md:px-10 py-8 md:py-10">
              {issues.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="max-w-md mx-auto">
                    {/* 
                      ILLUSTRATION NEEDED: History/Empty State illustration
                      - Storyset.com > Business Illustrations > Simple Background
                      - Colors: Green tones (#10B981, #059669)
                      - Style: Person looking at empty folder/documents
                      - Save as: history-illustration.png
                    */}
                    <img
                      src={HistoryIllustration}
                      alt="No reports yet"
                      className="w-72 h-72 mx-auto mb-8 object-contain opacity-90"
                    />
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      No Reports Yet
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      You haven't submitted any reports. Start by reporting an issue
                      in your community to make a positive impact.
                    </p>
                    <a
                      href="/report"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FileText className="w-5 h-5" />
                      Report Your First Issue
                    </a>
                  </div>
                </div>
              ) : (
                /* Reports List */
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.tracking_id}
                      className="border-2 border-gray-200 rounded-xl p-5 md:p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 bg-white"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left Section - Issue Info */}
                        <div className="flex-1 space-y-3">
                          {/* Tracking ID */}
                          <div
                            onClick={() => copyTrackingId(issue.tracking_id)}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors group"
                          >
                            <code className="font-mono text-sm font-bold text-emerald-600">
                              {issue.tracking_id}
                            </code>
                            {copiedId === issue.tracking_id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Clipboard className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900">
                            {issue.issue_title}
                          </h3>
                          {issue.appeal_status !== "not_appealed" && (
                            <p className="text-sm font-medium text-gray-600">
                              Appeal: {issue.appeal_status.replace("_", " ").toUpperCase()}
                            </p>
                          )}

                          {/* Location & Date */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{issue.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(issue.issue_date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Status */}
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          {issue.trust_score_delta !== 0 && (
                            <span
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                                issue.trust_score_delta < 0
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }`}
                            >
                              {issue.trust_score_delta > 0 ? "+" : ""}
                              {issue.trust_score_delta} trust
                            </span>
                          )}
                          <span
                            className={`px-5 py-2.5 text-sm rounded-full font-bold border-2 ${getStatusBadge(
                              issue.status
                            )}`}
                          >
                            {issue.status.replace("_", " ").toUpperCase()}
                          </span>
                          {issue.can_appeal && (
                            <button
                              onClick={() => submitAppeal(issue.id)}
                              disabled={appealingId === issue.id}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="w-4 h-4" />
                              {appealingId === issue.id
                                ? "Submitting..."
                                : "Appeal"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
