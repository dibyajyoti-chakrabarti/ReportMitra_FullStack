import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

function IssueAction() {
  const [reportData] = useOutletContext();

  const [afterImageUrl, setAfterImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const trackingID = reportData?.tracking_id || "Fetching Data...";
  const status = reportData?.status
    ? reportData.status.replace("_", " ").toUpperCase()
    : "Fetching Data...";
  const dept = reportData?.department || "Fetching Data...";
  const ackDate = reportData?.issue_date
    ? new Date(reportData.issue_date).toLocaleDateString()
    : "Fetching Data...";
  const resolutionDate =
    reportData?.status === "resolved"
      ? new Date(reportData.updated_at).toLocaleDateString()
      : "Pending";
  const escalated = reportData?.status === "in_progress" ? "Yes" : "No";

  // 🔹 Fetch completion (after) image via presigned URL
  useEffect(() => {
    async function fetchCompletionImage() {
      if (!reportData?.id) return;

      setLoadingImage(true);

      try {
        const res = await fetch(
          `${API_BASE}/api/reports/${reportData.id}/presign-get/`
        );
        const data = await res.json();

        setAfterImageUrl(data.after || null);
      } catch (err) {
        console.error("Failed to load completion image:", err);
        setAfterImageUrl(null);
      } finally {
        setLoadingImage(false);
      }
    }

    fetchCompletionImage();
  }, [reportData?.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      {/* Left Column */}
      <div className="bg-white border rounded-xl p-5 flex flex-col gap-3">
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Tracking ID: </span> {trackingID}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Current Status: </span> {status}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Department: </span> {dept}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Date of Acknowledgement: </span> {ackDate}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Date of Resolution: </span>{" "}
          {resolutionDate}
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-white border rounded-xl p-5 flex flex-col">
        <p className="font-bold text-lg lg:text-[17px] mb-2 text-center">
          Completion Image
        </p>

        <div
          className="bg-gray-50 border rounded-md p-4
          flex items-center justify-center
          aspect-[4/3] shadow-inner"
        >
          {loadingImage ? (
            <span className="text-gray-500 text-sm">
              Loading completion image…
            </span>
          ) : afterImageUrl ? (
            <img
              src={afterImageUrl}
              alt="Completion"
              className="w-full h-full object-contain rounded-md"
            />
          ) : (
            <span className="text-gray-500 text-sm">
              No completion image available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueAction;
