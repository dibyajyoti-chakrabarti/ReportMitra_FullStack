import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { Clipboard, Check, Loader2, FileText } from "lucide-react";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import { getApiUrl } from "../utils/api";

const History = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700">
        <Loader2 className="h-14 w-14 animate-spin text-gray-900" />
        <p className="text-lg font-semibold tracking-wide">
          Fetching your reports
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">
        <div
          className="bg-white w-full max-w-6xl rounded-2xl shadow-md
        px-4 sm:px-6 md:px-10 py-6 md:py-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">
            My Report History
          </h1>

          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Reports Yet
              </h3>
              <p className="text-gray-500 max-w-md">
                You haven't submitted any reports. Start by reporting an issue in your community to make a positive impact.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.tracking_id}
                  className="border rounded-xl p-4
                flex flex-col md:flex-row md:items-center md:justify-between gap-4
                hover:shadow-sm transition"
                >
                  <div className="space-y-1">
                    <span
                      onClick={() => copyTrackingId(issue.tracking_id)}
                      className="font-mono text-sm cursor-pointer text-blue-600
                    hover:underline flex items-center gap-1 w-fit"
                    >
                      {issue.tracking_id}
                      {copiedId === issue.tracking_id ? (
                        <Check size={14} />
                      ) : (
                        <Clipboard size={14} />
                      )}
                    </span>

                    <div className="font-semibold text-base">
                      {issue.issue_title}
                    </div>

                    <div className="text-sm text-gray-600">
                      {issue.location}
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 text-sm rounded-full font-semibold
                  self-start md:self-center
                  ${
                    issue.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : issue.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : issue.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  >
                    {issue.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;