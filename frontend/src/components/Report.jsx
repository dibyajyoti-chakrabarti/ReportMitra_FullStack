import { useState, useEffect } from "react";
import Navbar from "./MiniNavbar";
import { useAuth } from "../AuthProvider";
import Footer from "./Footer";

import { classifyImage } from "../ai/classifyImage";
import { useMap } from "react-leaflet";
import {
  User,
  FileText,
  Image as ImageIcon,
  MapPin,
  AlertCircle,
  CheckCircle,
  X,
  Copy as CopyIcon,
  ArrowRight,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { getApiUrl } from "../utils/api";

function Report() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showUnverifiedPopup, setShowUnverifiedPopup] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const { user, getAuthHeaders } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [tempPosition, setTempPosition] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [showRateLimitPopup, setShowRateLimitPopup] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState(
    "You cannot post any report until 12:00 AM IST."
  );
  const [isRateLimitedToday, setIsRateLimitedToday] = useState(false);
  const INDIA_CENTER = [20.5937, 78.9629];
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState(5);
  const [hasZoomedToUser, setHasZoomedToUser] = useState(false);

  const [isClassifying, setIsClassifying] = useState(false);

  const [formData, setFormData] = useState({
    issue_title: "",
    location: "",
    issue_description: "",
    image_url: "",
  });

  const [errors, setErrors] = useState({
    issue_title: "",
    issue_description: "",
    image: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(getApiUrl("/profile/me/"), {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);

          if (!data.is_aadhaar_verified) {
            setShowUnverifiedPopup(true);
          }
        } else {
          console.error("Failed to fetch profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (user) fetchUserProfile();
  }, [user, getAuthHeaders]);

  useEffect(() => {
    const fetchSubmissionEligibility = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(getApiUrl("/reports/eligibility/"), { headers });
        if (!response.ok) return;

        const data = await response.json();
        if (data.can_submit === false) {
          setIsRateLimitedToday(true);
          const retryLabel = data.retry_at_label || "12:00 AM IST";
          setRateLimitMessage(
            `You have reached the daily report limit. You cannot post any report until ${retryLabel}.`
          );
          setShowRateLimitPopup(true);
        } else {
          setIsRateLimitedToday(false);
        }
      } catch (error) {
        console.error("Failed to fetch report eligibility:", error);
      }
    };

    if (user) fetchSubmissionEligibility();
  }, [user, getAuthHeaders]);

  useEffect(() => {
    if (!showMap) return;

    // If there's already a selected position, zoom to that instead
    if (tempPosition) {
      setMapCenter(tempPosition);
      setMapZoom(18);
      return;
    }

    // Only zoom to user location if we haven't done it before
    if (hasZoomedToUser) return;

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setMapCenter(INDIA_CENTER);
      setMapZoom(5);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(18);
        setTempPosition([latitude, longitude]);
        setHasZoomedToUser(true); // Mark that we've zoomed to user location
      },
      (err) => {
        console.warn("Location permission denied", err);
        setMapCenter(INDIA_CENTER);
        setMapZoom(5);
        setHasZoomedToUser(true); // Mark as done even on error
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [showMap, hasZoomedToUser, tempPosition]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setFormData((p) => ({ ...p, image_url: "" }));
      setErrors((p) => ({ ...p, image: "" }));
    } else {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setSelectedFile(null);
      setPreview(null);
      setFormData((p) => ({ ...p, image_url: "" }));
    }
  };

  const uploadFileToS3 = async (file) => {
    const authHeaders =
      typeof getAuthHeaders === "function" ? await getAuthHeaders() : {};

    const presignResp = await fetch(getApiUrl("/reports/s3/presign/"), {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });

    if (!presignResp.ok) {
      const err = await presignResp.text();
      throw new Error("Presign failed: " + err);
    }
    const { url: presignedUrl, key } = await presignResp.json();

    const putResp = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putResp.ok) {
      const txt = await putResp.text();
      throw new Error("S3 upload failed: " + txt);
    }

    return { key };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      issue_title: "",
      issue_description: "",
      image: "",
      location: "",
    });

    if (!userProfile?.is_aadhaar_verified) {
      setShowUnverifiedPopup(true);
      return;
    }
    if (isRateLimitedToday) {
      setShowRateLimitPopup(true);
      return;
    }
    if (userProfile?.is_temporarily_deactivated) {
      const until = userProfile?.deactivated_until
        ? new Date(userProfile.deactivated_until).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "later";
      alert(`Account activates on ${until}`);
      return;
    }

    // Validation
    let hasError = false;
    if (!formData.issue_title.trim()) {
      setErrors((p) => ({ ...p, issue_title: "Issue title is required" }));
      hasError = true;
    }
    if (!formData.issue_description.trim()) {
      setErrors((p) => ({
        ...p,
        issue_description: "Issue description is required",
      }));
      hasError = true;
    }
    if (!selectedFile) {
      setErrors((p) => ({ ...p, image: "Issue image is required" }));
      hasError = true;
    }
    if (!formData.location) {
      setErrors((p) => ({
        ...p,
        location: "Please choose the issue location",
      }));
      hasError = true;
    }
    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        alert("Please log in before submitting a report.");
        setIsSubmitting(false);
        return;
      }

      if (!userProfile) {
        alert("Profile data is still loading. Please wait and try again.");
        setIsSubmitting(false);
        return;
      }

      let imageUrl = formData.image_url || "";

      // Step 1: Upload image to S3
      if (selectedFile) {
        try {
          const { key } = await uploadFileToS3(selectedFile);
          imageUrl = key;

          if (import.meta.env.DEV) {
            console.log("Uploaded image URL:", imageUrl);
          }
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Step 2: Classify image using the existing API-key flow
      let department = "Manual";
      if (selectedFile) {
        try {
          setIsClassifying(true);
          const imageBase64 = await fileToBase64(selectedFile);
          department = await classifyImage(imageBase64);
          setIsClassifying(false);
          if (import.meta.env.DEV) {
            console.log("AI Department:", department);
          }
          setIsClassifying(false);
        } catch (err) {
          console.error("Classification failed:", err);
          setIsClassifying(false);
        }
      }

      // Step 3: Submit report
      const headers =
        typeof getAuthHeaders === "function"
          ? await getAuthHeaders()
          : { "Content-Type": "application/json" };

      const payload = {
        issue_title: formData.issue_title,
        location: formData.location,
        issue_description: formData.issue_description,
        image_url: imageUrl,
        department: department,
        status: "pending",
      };

      const response = await fetch(getApiUrl("/reports/"), {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errDetail = "Failed to submit report";
        let errCode = "";
        try {
          const errJson = await response.json();
          errCode = errJson.code || "";
          if (errCode === "DAILY_REPORT_LIMIT") {
            const retryLabel = errJson.retry_at_label || "12:00 AM IST";
            setRateLimitMessage(
              `You have reached the daily report limit. You cannot post any report until ${retryLabel}.`
            );
            setShowRateLimitPopup(true);
            return;
          }
          errDetail = errJson.detail || JSON.stringify(errJson);
        } catch {
          const errText = await response.text().catch(() => null);
          if (errText) errDetail = errText;
        }
        if (errDetail.includes("Daily report limit")) {
          setRateLimitMessage(
            "You have reached the daily report limit. You cannot post any report until 12:00 AM IST."
          );
          setShowRateLimitPopup(true);
          return;
        }
        throw new Error(errDetail);
      }

      const result = await response.json();
      if (import.meta.env.DEV) {
        console.log("Report submit result:", result);
      }
      setApplicationId(result.tracking_id);
      setShowSuccessPopup(true);

      setFormData({
        issue_title: "",
        location: "",
        issue_description: "",
        image_url: "",
        department: "",
      });
      setSelectedFile(null);
      setPreview(null);
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Submit error:", err);
      if (err.message?.includes("issue_title")) {
        setErrors((p) => ({ ...p, issue_title: "Issue title is required" }));
      }
      if (err.message?.includes("issue_description")) {
        setErrors((p) => ({
          ...p,
          issue_description: "Issue description is required",
        }));
      }
    } finally {
      setIsSubmitting(false);
      setIsClassifying(false);
    }
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const closePopup = () => {
    setShowSuccessPopup(false);
    setApplicationId(null);
  };

  const copyToClipboard = () => {
    if (applicationId) {
      navigator.clipboard.writeText(applicationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const aadhaar = userProfile?.aadhaar || null;
  let firstNameDisplay = "Not provided";
  let middleNameDisplay = "N/A";
  let lastNameDisplay = "Not provided";

  if (!userProfile) {
    firstNameDisplay = middleNameDisplay = lastNameDisplay = "Loading...";
  } else if (aadhaar) {
    let firstName = aadhaar.first_name || "";
    let middleName = aadhaar.middle_name || "";
    let lastName = aadhaar.last_name || "";

    if ((!firstName || !lastName) && aadhaar.full_name) {
      const parts = aadhaar.full_name.trim().split(/\s+/);
      if (parts.length === 1) {
        firstName = firstName || parts[0];
      } else if (parts.length === 2) {
        firstName = firstName || parts[0];
        lastName = lastName || parts[1];
      } else if (parts.length >= 3) {
        firstName = firstName || parts[0];
        lastName = lastName || parts[parts.length - 1];
        middleName = middleName || parts.slice(1, -1).join(" ");
      }
    }

    firstNameDisplay = firstName || "Not provided";
    middleNameDisplay = middleName || "N/A";
    lastNameDisplay = lastName || "Not provided";
  }

  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  function LocationPicker({ onSelect, position }) {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        onSelect(lat, lng);
      },
    });

    return position ? <Marker position={position} icon={blueIcon} /> : null;
  }

  function RecenterMap({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
      map.setView(center, zoom, { animate: true });
    }, [center, zoom]);

    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Report Submitted Successfully!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your issue has been registered and will be reviewed shortly.
            </p>

            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                Your Tracking ID:
              </p>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-emerald-300">
                <span className="font-mono font-bold text-emerald-600 text-lg">
                  {applicationId}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <CopyIcon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Save this ID to track your report status
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={closePopup}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  closePopup();
                  window.location.href = `/track`;
                }}
                className="text-emerald-600 hover:text-emerald-700 underline font-bold"
              >
                Track this report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Daily Limit Popup */}
      {showRateLimitPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Daily Report Limit Reached
            </h2>

            <p className="text-gray-600 mb-6">
              {rateLimitMessage}
            </p>

            <button
              onClick={() => setShowRateLimitPopup(false)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Unverified Popup */}
      {showUnverifiedPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-orange-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Aadhaar Verification Required
            </h2>
            <p className="text-gray-600 text-center mb-6">
              You must verify your Aadhaar before submitting reports. Please complete verification in your profile settings.
            </p>

            <button
              onClick={() => (window.location.href = "/profile")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-all mb-3"
            >
              Verify Now
            </button>
            <button
              onClick={() => setShowUnverifiedPopup(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Select Issue Location</h3>
              <button
                onClick={() => {
                  setTempLocation(null);
                  setTempPosition(null);
                  setShowMap(false);
                }}
                className="text-white hover:bg-emerald-700 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div style={{ height: "500px", width: "100%" }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap center={mapCenter} zoom={mapZoom} />
                <LocationPicker
                  position={tempPosition}
                  onSelect={async (lat, lng) => {
                    setTempPosition([lat, lng]);

                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
                        { headers: { "User-Agent": "ReportMitra/1.0" } }
                      );
                      const data = await res.json();
                      setTempLocation(data.display_name || `${lat}, ${lng}`);
                    } catch {
                      setTempLocation(`${lat}, ${lng}`);
                    }
                  }}
                />
              </MapContainer>
            </div>

            <div className="p-6 bg-gray-50">
              {tempLocation && (
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-emerald-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Selected Location:</p>
                  <p className="text-gray-900">{tempLocation}</p>
                </div>
              )}

              <div className="flex gap-3">
                {tempLocation && (
                  <button
                    onClick={() => {
                      setFormData((p) => ({ ...p, location: tempLocation }));
                      setErrors((p) => ({ ...p, location: "" }));
                      setTempLocation(null);
                      setTempPosition(null);
                      setShowMap(false);
                    }}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition"
                  >
                    Confirm Location
                  </button>
                )}
                <button
                  onClick={() => {
                    setTempLocation(null);
                    setTempPosition(null);
                    setShowMap(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow flex justify-center py-12 px-4">
        <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Report a Civic Issue
            </h1>
            <p className="text-gray-600">
              Help improve your community by reporting issues that need attention
            </p>
          </div>

          <div className="space-y-8">
            {/* Citizen Details */}
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Citizen Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={firstNameDisplay}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={middleNameDisplay}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={lastNameDisplay}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    readOnly
                    value={getCurrentDate()}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Issue Details
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side - Text inputs */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Issue Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="issue_title"
                      placeholder="Briefly describe the issue (e.g., 'Broken streetlight on MG Road')"
                      value={formData.issue_title}
                      onChange={handleInputChange}
                      maxLength={80}
                      className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formData.issue_title.length}/80 characters
                      </span>
                      {errors.issue_title && (
                        <span className="text-xs text-red-600 font-semibold">
                          {errors.issue_title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Issue Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="issue_description"
                      value={formData.issue_description}
                      onChange={handleInputChange}
                      placeholder="Provide detailed information about the issue, including when you noticed it and any relevant details..."
                      maxLength={500}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none h-40 transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-xs ${
                          formData.issue_description.length > 450
                            ? "text-orange-600 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {formData.issue_description.length}/500 characters
                      </span>
                      {errors.issue_description && (
                        <span className="text-xs text-red-600 font-semibold">
                          {errors.issue_description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Issue Location <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        readOnly
                        required
                        placeholder="Select location from map"
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                      >
                        Select on Map
                      </button>
                    </div>
                    {errors.location && (
                      <p className="text-xs text-red-600 font-semibold mt-2">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side - Image upload */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Issue Image <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex-1 border-2 border-dashed border-emerald-300 rounded-xl bg-white min-h-[280px] flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-emerald-600">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm font-medium opacity-75">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer bg-white hover:bg-gray-50 border-2 border-emerald-600 text-emerald-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-sm hover:shadow-md"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Choose Image
                    </label>

                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile && (
                      <p className="text-xs text-gray-700 text-center truncate">
                        📎 {selectedFile.name}
                      </p>
                    )}

                    {errors.image && (
                      <p className="text-xs text-red-600 font-semibold text-center">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isClassifying}
                className="group bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isClassifying ? "Analyzing image..." : "Submitting Report..."}
                  </>
                ) : (
                  <>
                    Submit Report
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Report;
