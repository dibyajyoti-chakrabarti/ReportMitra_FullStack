import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../config/backend";
import { getApiUrl } from "../utils/api";

function IssueAction() {
  const [reportData] = useOutletContext();

  const [afterImageUrl, setAfterImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

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

  useEffect(() => {
    async function fetchCompletionImage() {
      if (!reportData?.id) return;

      setLoadingImage(true);

      try {
        const presignUrl = getApiUrl(`/reports/${reportData.id}/presign-get/`);

        const res = await fetch(presignUrl);
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
    <section
      className="mt-6 bg-white border-t-1 border-black
    rounded-2xl shadow-sm px-5 sm:px-8 py-6 sm:py-8
    max-w-4xl mx-auto border-b-1"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Action Taken Report
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tracking ID: <span className="font-semibold">{trackingID}</span>
        </p>
      </div>

      <hr className="mb-6" />

      <div className="space-y-3 text-base sm:text-lg">
        <div>
          <span className="font-semibold">Current Status:</span>{" "}
          <span className="uppercase">{status}</span>
        </div>

        <div>
          <span className="font-semibold">Department:</span> {dept}
        </div>

        <div>
          <span className="font-semibold">Date of Acknowledgement:</span>{" "}
          {ackDate}
        </div>

        <div>
          <span className="font-semibold">Date of Resolution:</span>{" "}
          {resolutionDate}
        </div>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="font-bold text-lg mb-3 text-center">
          Completion Evidence
        </h3>

        <div
          className="w-full max-h-[480px] border rounded-xl
        bg-gray-100 flex items-center justify-center
        overflow-hidden relative"
        >
          {loadingImage && (
            <span className="text-sm text-gray-600">
              Loading completion image…
            </span>
          )}

          {!loadingImage && afterImageUrl && (
            <img
              src={afterImageUrl}
              alt="Completion"
              className="w-full h-full object-contain"
            />
          )}

          {!loadingImage && !afterImageUrl && (
            <span className="text-sm text-gray-500">
              No completion image available
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default IssueAction;
