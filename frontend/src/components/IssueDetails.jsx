import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";

export default function IssueDetails() {
  const [reportData] = useOutletContext();
  const [imgSrc, setImgSrc] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgError, setImgError] = useState("");
  const issueID = reportData?.tracking_id ?? "N/A";
  const issueTitle = reportData?.issue_title ?? "N/A";
  const issueDesc = reportData?.issue_description ?? "N/A";
  const issueLocation = reportData?.location ?? "N/A";
  const { getAuthHeaders } = useAuth();
  const [fullName, setFullName] = useState("Loading...");
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

      const backend =
        import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000/api";
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
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me/`, {
      method: "GET",
      headers: headers,
    });

    if (res.ok) {
      const profile = await res.json();
      const aadhaar = profile.aadhaar || {};
      setFullName(aadhaar.full_name || "N/A");
    } else {
      setFullName("N/A");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      {/* Left Column */}
      <div
        className="bg-white border rounded-xl p-5
flex flex-col gap-3 justify-center min-h-[420px]"
      >
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Tracking ID: </span> {issueID}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Full Name: </span> {fullName}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Title: </span> {issueTitle}
        </div>
        <div className="sm:text-lg lg:text-[18px] flex flex-col bg-gray-50 border rounded-md p-3 text-sm leading-relaxed overflow-y-auto max-h-40">
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
      <div
        className="bg-white border rounded-xl p-5
flex flex-col items-center justify-center min-h-[420px]"
      >
        <p className="font-bold text-lg lg:text-[18px] mb-2 text-center">
          Issue Image
        </p>

        <div
          className="w-full aspect-[4/3] border rounded-lg
flex items-center justify-center bg-gray-100 relative overflow-hidden"
        >
          {loadingImg && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center
  bg-gray-200/80 backdrop-blur-sm"
            >
              <svg
                className="animate-spin h-10 w-10 text-gray-800 mb-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Loading image…
              </span>
            </div>
          )}

          {!loadingImg && imgSrc && (
            <img
              src={imgSrc}
              alt={issueTitle}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}

          {!loadingImg && !imgSrc && imgError && (
            <div
              className="flex flex-col items-center justify-center
text-sm text-gray-500"
            >
              {imgError}
            </div>
          )}

          {!loadingImg && !imgSrc && !imgError && (
            <div
              className="flex flex-col items-center justify-center
text-sm text-gray-500"
            >
              No image available
            </div>
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
