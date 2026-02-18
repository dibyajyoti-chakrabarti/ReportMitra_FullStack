import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { BACKEND_BASE_URL } from "../config/backend";
import { getApiUrl } from "../utils/api";
import {
  User,
  MapPin,
  Calendar,
  FileText,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";

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
    ? new Date(reportData.issue_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
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

  const infoItems = [
    { label: "Reporter Name", value: fullName, icon: User },
    { label: "Issue Title", value: issueTitle, icon: FileText },
    { label: "Location", value: issueLocation, icon: MapPin },
    { label: "Reported On", value: issueDate, icon: Calendar },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 md:px-8 py-6 text-white">
        <h2 className="text-2xl md:text-3xl font-black mb-2">Issue Report</h2>
        <div className="flex items-center gap-2 text-emerald-50">
          <span className="text-sm font-semibold">Tracking ID:</span>
          <code className="bg-white/20 px-3 py-1 rounded-lg font-mono text-sm font-bold">
            {issueID}
          </code>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 md:py-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {infoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-gray-700">
                    {item.label}
                  </span>
                </div>
                <p className="text-gray-900 font-medium break-words">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Description */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Issue Description
            </h3>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {issueDesc}
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Image Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">Issue Image</h3>
          </div>

          <div className="border-2 border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
            <div className="aspect-video w-full flex items-center justify-center relative">
              {loadingImg && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
                  <span className="text-sm font-semibold text-gray-600">
                    Loading image...
                  </span>
                </div>
              )}

              {!loadingImg && imgSrc && (
                <img
                  src={imgSrc}
                  alt={issueTitle}
                  className="w-full h-full object-contain bg-gray-900"
                />
              )}

              {!loadingImg && !imgSrc && (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2 opacity-30" />
                  <span className="text-sm">{imgError || "No image available"}</span>
                </div>
              )}
            </div>

            {imgSrc && (
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex flex-wrap gap-3 justify-center">
                <a
                  href={imgSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <a
                  href={imgSrc}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}