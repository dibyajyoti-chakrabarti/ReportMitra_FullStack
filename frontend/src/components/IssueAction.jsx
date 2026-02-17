import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../config/backend";
import { getApiUrl } from "../utils/api";
import {
  CheckCircle,
  Clock,
  Building2,
  Calendar,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
    ? new Date(reportData.issue_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Fetching Data...";
  const resolutionDate =
    reportData?.status === "resolved"
      ? new Date(reportData.updated_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Pending";

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

  // Status color mapping
  const getStatusColor = () => {
    if (reportData?.status === "resolved") return "bg-green-100 text-green-800 border-green-300";
    if (reportData?.status === "in_progress") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const infoItems = [
    {
      label: "Department",
      value: dept,
      icon: Building2,
    },
    {
      label: "Date of Acknowledgement",
      value: ackDate,
      icon: Calendar,
    },
    {
      label: "Date of Resolution",
      value: resolutionDate,
      icon: CheckCircle,
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 md:px-8 py-6 text-white">
        <h2 className="text-2xl md:text-3xl font-black mb-2">
          Action Taken Report
        </h2>
        <div className="flex items-center gap-2 text-emerald-50">
          <span className="text-sm font-semibold">Tracking ID:</span>
          <code className="bg-white/20 px-3 py-1 rounded-lg font-mono text-sm font-bold">
            {trackingID}
          </code>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 md:py-8">
        {/* Status Badge */}
        <div className="mb-8 flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold text-lg ${getStatusColor()}`}
          >
            <Clock className="w-5 h-5" />
            Current Status: {status}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <p className="text-gray-900 font-medium">{item.value}</p>
              </div>
            );
          })}
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Completion Evidence Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Completion Evidence
            </h3>
          </div>

          <div className="border-2 border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
            <div className="aspect-video w-full flex items-center justify-center relative">
              {loadingImage && (
                <div className="flex flex-col items-center text-gray-500">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
                  <span className="text-sm font-semibold">
                    Loading completion image...
                  </span>
                </div>
              )}

              {!loadingImage && afterImageUrl && (
                <img
                  src={afterImageUrl}
                  alt="Completion Evidence"
                  className="w-full h-full object-contain bg-gray-900"
                />
              )}

              {!loadingImage && !afterImageUrl && (
                <div className="flex flex-col items-center text-gray-400">
                  <AlertCircle className="w-16 h-16 mb-3 opacity-30" />
                  <span className="text-sm font-medium">
                    No completion image available yet
                  </span>
                  <span className="text-xs mt-1">
                    Evidence will be uploaded once the issue is resolved
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Info */}
          {reportData?.status !== "resolved" && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  {reportData?.status === "in_progress"
                    ? "Work in Progress"
                    : "Awaiting Action"}
                </p>
                <p>
                  {reportData?.status === "in_progress"
                    ? "Your complaint is being actively worked on by the assigned department. Completion evidence will be uploaded once resolved."
                    : "Your complaint has been registered and is pending assignment to the appropriate department."}
                </p>
              </div>
            </div>
          )}

          {reportData?.status === "resolved" && (
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Issue Resolved!</p>
                <p>
                  Thank you for reporting this issue. Your contribution helps make
                  our community better. The completion evidence above shows the
                  resolved state of the reported issue.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default IssueAction;