// src/components/IssueDetails.jsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function IssueDetails() {
  const [reportData] = useOutletContext();
  const [imgSrc, setImgSrc] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgError, setImgError] = useState("");

  const issueID = reportData?.tracking_id ?? "N/A";
  const firstName = reportData?.reporter_first_name ?? "N/A";
  const midName = reportData?.reporter_middle_name ?? "";
  const lastName = reportData?.reporter_last_name ?? "N/A";
  const issueTitle = reportData?.issue_title ?? "N/A";
  const issueDesc = reportData?.issue_description ?? "N/A";
  const issueLocation = reportData?.location ?? "N/A";
  const issueDate = reportData?.issue_date
    ? new Date(reportData.issue_date).toLocaleDateString()
    : "N/A";

  useEffect(() => {
    let cancelled = false;
    async function fetchPresigned() {
      setImgError("");
      setImgSrc(null);

      if (!reportData || !reportData.id) return;

      setLoadingImg(true);

      const backend = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000/api";
      const presignUrl = `${backend}/reports/${reportData.id}/presign-get/`;

      try {
        const res = await fetch(presignUrl, { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            // backend returns { url } (presigned GET) on success
            if (json.url) {
              setImgSrc(json.url);
              setLoadingImg(false);
              return;
            }
          }
        }

        // Fallback: if presign failed or returned no url, try using image_url directly
        if (reportData.image_url) {
          // decode percent-encoding if present
          const decoded = decodeURIComponent(reportData.image_url);
          if (!cancelled) setImgSrc(decoded);
        } else {
          if (!cancelled) setImgError("No image available for this report.");
        }
      } catch (err) {
        // network or other error -> fallback to direct image_url
        if (reportData?.image_url) {
          const decoded = decodeURIComponent(reportData.image_url);
          if (!cancelled) setImgSrc(decoded);
        } else {
          if (!cancelled) setImgError("Failed to load image.");
        }
      } finally {
        if (!cancelled) setLoadingImg(false);
      }
    }

    fetchPresigned();
    return () => {
      cancelled = true;
    };
  }, [reportData]);

  return (
    <div className="flex flex-col lg:flex-row border-2 border-dashed border-gray-400 mt-3 rounded-xl shadow-sm">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 p-5 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-gray-400">
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Tracking ID: </span> {issueID}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Full Name: </span> {firstName} {midName} {lastName}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Title: </span> {issueTitle}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px] flex flex-col bg-gray-50 border border-gray-300 p-2 rounded-md overflow-y-auto max-h-40">
          <span className="font-bold">Issue Description: </span> {issueDesc}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Location: </span> {issueLocation}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Date: </span> {issueDate}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-5">
        <p className="font-bold text-lg lg:text-[18px] mb-2 text-center">Issue Image</p>

        <div className="relative bg-gray-900 w-full max-w-sm aspect-[4/3] rounded-lg shadow-md overflow-hidden flex items-center justify-center text-white">
          {loadingImg && (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 mb-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <div className="text-sm text-gray-200">Loading image...</div>
            </div>
          )}

          {!loadingImg && imgSrc && (
            <img src={imgSrc} alt={issueTitle} className="w-full h-full object-contain" loading="lazy" />
          )}

          {!loadingImg && !imgSrc && imgError && (
            <div className="text-center p-4 text-sm text-gray-300">{imgError}</div>
          )}

          {!loadingImg && !imgSrc && !imgError && (
            <div className="text-center p-4 text-sm text-gray-300">No image available</div>
          )}
        </div>

        {/* optional actions */}
        <div className="mt-3 flex gap-2">
          {imgSrc ? (
            <>
              <a
                href={imgSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-white text-black rounded shadow-sm text-sm"
              >
                Open Image
              </a>
              <a
                href={imgSrc}
                download
                className="px-3 py-1 bg-gray-700 text-white rounded shadow-sm text-sm"
              >
                Download
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
