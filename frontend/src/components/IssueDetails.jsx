import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { BACKEND_BASE_URL } from "../config/backend";
import { getApiUrl } from "../utils/api";

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

      const backend = import.meta.env.VITE_BACKEND_URL ?? `${BACKEND_BASE_URL}`;
      const presignUrl = getApiUrl(`/reports/${reportData.id}/presign-get/`);

      try {
        const res = await fetch(presignUrl, { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            if (json.url) {
              setImgSrc(json.url);
              setLoadingImg(false);
              return;
            }
          }
        }

        if (reportData.image_url) {
          const decoded = decodeURIComponent(reportData.image_url);
          if (!cancelled) setImgError("Image unavailable");
        } else {
          if (!cancelled) setImgError("No image available for this report.");
        }
      } catch (err) {
        if (reportData?.image_url) {
          const decoded = decodeURIComponent(reportData.image_url);
          if (!cancelled) setImgError("Image unavailable");
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
    const profileUrl = getApiUrl("/profile/me/");

    const res = await fetch(profileUrl, {
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
    <section
      className="mt-6 bg-white border-t-1 border-black
    rounded-2xl shadow-sm px-5 sm:px-8 py-6 sm:py-8
    max-w-4xl mx-auto border-b-1"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Issue Report</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tracking ID: <span className="font-semibold">{issueID}</span>
        </p>
      </div>

      <hr className="mb-6" />

      <div className="space-y-3 text-base sm:text-lg">
        <div>
          <span className="font-semibold">Full Name:</span> {fullName}
        </div>
        <div>
          <span className="font-semibold">Issue Title:</span> {issueTitle}
        </div>
        <div>
          <span className="font-semibold">Location:</span> {issueLocation}
        </div>
        <div>
          <span className="font-semibold">Reported On:</span> {issueDate}
        </div>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="font-bold text-lg mb-2">Issue Description</h3>
        <div
          className="bg-gray-50 border rounded-lg p-4
        text-sm sm:text-base leading-relaxed break-words"
        >
          {issueDesc}
        </div>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="font-bold text-lg mb-3 text-center">Issue Image</h3>

        <div
          className="w-full max-h-[480px] border rounded-xl
        bg-gray-100 flex items-center justify-center
        overflow-hidden relative"
        >
          {loadingImg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200/80">
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
              <span className="text-sm font-semibold">Loading image…</span>
            </div>
          )}

          {!loadingImg && imgSrc && (
            <img
              src={imgSrc}
              alt={issueTitle}
              className="w-full h-full object-contain"
            />
          )}

          {!loadingImg && !imgSrc && (
            <span className="text-sm text-gray-500">
              {imgError || "No image available"}
            </span>
          )}
        </div>

        {imgSrc && (
          <div className="flex justify-center gap-3 mt-4">
            <a
              href={imgSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
            >
              Open Image
            </a>
            <a
              href={imgSrc}
              download
              className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
