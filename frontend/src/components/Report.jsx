import { useState, useEffect } from "react";
import Navbar from "./MiniNavbar";
import folder from "../assets/foldericon.png";
import { useAuth } from "../AuthProvider";
import Footer from "./Footer";
import Tick from "../assets/tick.png";
import Copy from "../assets/copy.jpg";
import { classifyImage } from "../ai/classifyImage";
import { User, FileText, Image as ImageIcon, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const API_BASE = "http://localhost:8000";

function Report() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const { user, getAuthHeaders } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    issue_title: "",
    location: "",
    issue_description: "",
    image_url: "",
  });

  // --- Load profile (Aadhaar-backed) ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/api/profile/me/`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Failed to fetch profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (user) fetchUserProfile();
  }, [user, getAuthHeaders]);



  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setFormData((p) => ({ ...p, image_url: "" }));
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

    const presignResp = await fetch(`${API_BASE}/api/reports/s3/presign/`, {
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

    const S3_BUCKET =
      import.meta.env.VITE_S3_BUCKET || "reportmitra-report-images-dc";
    const AWS_REGION = import.meta.env.VITE_AWS_REGION || "ap-south-1";

    const objectUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(
      key
    )}`;

    return { objectUrl, key };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // produces "data:image/jpeg;base64,..."
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // --- Frontend guard: login + Aadhaar verification ---
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

      if (!userProfile.is_aadhaar_verified) {
        alert(
          "Please complete Aadhaar verification in your Profile page before creating a report."
        );
        setIsSubmitting(false);
        return;
      }

      if (!locationPermissionGranted || !formData.location) {
        alert("Location permission is mandatory to submit a report.");
        setIsSubmitting(false);
        return;
      }


      let imageUrl = formData.image_url || "";

      if (selectedFile) {
        try {
          const { objectUrl } = await uploadFileToS3(selectedFile);
          imageUrl = objectUrl;
          console.log("Uploaded image URL:", imageUrl);
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      let department = "Manual";
      if (selectedFile) {
        try {
          const base64 = await fileToBase64(selectedFile);
          department = await classifyImage(base64);
          console.log("AI Department:", department);
        } catch (err) {
          console.error("Classification failed:", err);
        }
      }

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

      const response = await fetch(`${API_BASE}/api/reports/`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errDetail = "Failed to submit report";
        try {
          const errJson = await response.json();
          errDetail = errJson.detail || JSON.stringify(errJson);
        } catch {
          const errText = await response.text().catch(() => null);
          if (errText) errDetail = errText;
        }
        throw new Error(errDetail);
      }

      const result = await response.json();
      console.log("Report submit result:", result);
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
      alert("Error: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const closePopup = () => {
    setShowSuccessPopup(false);
    setApplicationId(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(applicationId);
    alert("Application ID copied to clipboard!");
  };

  // Helper to safely read Aadhaar name fields
  const aadhaar = userProfile?.aadhaar || null;

  let firstNameDisplay = "Not provided";
  let middleNameDisplay = "Not provided";
  let lastNameDisplay = "Not provided";

  if (!userProfile) {
    firstNameDisplay = middleNameDisplay = lastNameDisplay = "Loading...";
  } else if (aadhaar) {
    let firstName = aadhaar.first_name || "";
    let middleName = aadhaar.middle_name || "";
    let lastName = aadhaar.last_name || "";

    // Fallback: if split names are missing but full_name exists
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
    middleNameDisplay = middleName || "Not provided";
    lastNameDisplay = lastName || "Not provided";
  }

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
          {
            headers: {
              "User-Agent": "ReportMitra/1.0",
            },
          }
        );
        const data = await res.json();
        onSelect(data.display_name || `${lat}, ${lng}`);
      } catch {
        onSelect(`${lat}, ${lng}`);
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">
                <img src={Tick} alt="" className="" />
              </span>
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Report Submitted Successfully!
            </h2>

            <p className="text-green-600 font-bold mb-4">
              Your report has been submitted and is now under review.
            </p>

            <div className="border-3 border-dashed border-green-600 rounded-lg p-4 mb-6">
              <p className="text-2xl text-green-600 mb-2 font-extrabold">
                Application ID for tracking
              </p>
              <div className="flex items-center justify-center">
                <div className="flex">
                  <code className="bg-green-200  border-2 px-3 text-2xl font-bold text-green-700 border-green-600 py-2 rounded-l-md flex items-center">
                    {applicationId}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="text-white  border-2 border-green-600 transition py-2 px-3 cursor-pointer rounded-r-md bg-green-600"
                    title="Copy to clipboard"
                  >
                    <img src={Copy} alt="" className="h-7" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={closePopup}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  closePopup();
                  window.location.href = `/track`;
                }}
                className="text-green-600 hover:text-green-700 underline hover:scale-110 cursor-pointer transition font-bold"
              >
                Track this report
              </button>
            </div>
          </div>
        </div>
      )}
      {showMap && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl w-full max-w-3xl p-4">
      <h2 className="text-xl font-bold mb-3 text-center">
        Choose Issue Location
      </h2>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker
            onSelect={(address) => {
              setFormData((p) => ({ ...p, location: address }));
              setLocationPermissionGranted(true);
              setShowMap(false);
            }}
          />
        </MapContainer>
      </div>

      <button
        onClick={() => setShowMap(false)}
        className="mt-4 w-full bg-black text-white py-2 rounded-lg font-bold"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      <main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">
        <div
          className="bg-white w-full max-w-6xl rounded-2xl shadow-md
          px-4 sm:px-6 md:px-10 py-6 md:py-8"
        >
          <h1 className="text-center font-extrabold text-3xl md:text-5xl mb-6">
            Issue a Report
          </h1>

          <div className="flex-1 flex flex-col justify-center">
            {/* User details */}
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-800">
                Citizen Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "First Name",
                  value: firstNameDisplay,
                },
                {
                  label: "Middle Name",
                  value: middleNameDisplay,
                },
                {
                  label: "Last Name",
                  value: lastNameDisplay,
                },
              ].map((f) => (
                <div key={f.label} className="flex flex-col font-bold">
                  <label>{f.label}</label>
                  <input
                    type="text"
                    readOnly
                    value={f.value}
                    className="border px-2 py-1 rounded-md text-gray-500"
                  />
                </div>
              ))}

              <div className="flex flex-col font-bold">
                <label>Issue Date</label>
                <input
                  type="date"
                  readOnly
                  value={getCurrentDate()}
                  className="border px-2 py-1 rounded-md text-gray-500"
                />
              </div>
            </div>

            <hr className="my-4" />

            {/* Issue Details Section Header */}
            <div className="flex items-center gap-2 mb-4 mt-6">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-800">
                Issue Details
              </h2>
            </div>

            {/* Issue details */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-6">
              {/* Left */}
              <div className="md:col-span-3 flex flex-col font-bold space-y-2">
                <label>Issue Title</label>
                <input
                  type="text"
                  name="issue_title"
                  placeholder="Name the Issue"
                  value={formData.issue_title}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded-md placeholder:text-gray-500"
                  required
                />

                <label>Issue Description</label>
                <textarea
                  name="issue_description"
                  value={formData.issue_description}
                  onChange={handleInputChange}
                  placeholder="Describe the Issue in Detail"
                  required
                  className="border px-3 py-2 rounded-md placeholder:text-gray-500 resize-none h-44 lg:h-56"
                />
              </div>

              {/* Right */}
              <div className="md:col-span-2 flex flex-col font-bold space-y-3">
                <label>Issue Image</label>
                <a
                  href="https://www.precisely.com/glossary/geotagging/"
                  className="underline text-sm text-blue-700 -mt-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                
                {/* Image Preview */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl
                  h-44 lg:h-56
                  flex flex-col items-center justify-center gap-2
                  text-gray-500 overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-contain w-full h-full rounded-xl"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 opacity-60" />
                      <span className="text-xs text-gray-400">
                        No image selected
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-white border-2 border-gray-400 px-4 py-2.5 rounded-md
  flex items-center justify-center gap-2 text-sm font-semibold
  hover:bg-gray-50 hover:border-gray-400 transition"
                  >
                    <img src={folder} alt="" className="h-4 w-4" />
                    Choose File
                  </label>

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {selectedFile && (
                    <span className="text-xs text-gray-600 text-center truncate">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div
              className="flex flex-col md:flex-row justify-between items-center
              border-t pt-6 mt-6 gap-4"
            >
              <div className="flex flex-col gap-2 font-bold w-full md:max-w-[60%]">
  <label className="whitespace-nowrap flex items-center gap-1">
    <MapPin className="w-4 h-4 text-gray-600" />
    Issue Location
  </label>

  <div className="flex gap-2 w-full">
    <input
      type="text"
      name="location"
      value={formData.location}
      readOnly
      required
      placeholder="Choose location from map"
      className="border px-3 py-2 rounded-md w-full
      bg-gray-100 text-gray-600 cursor-not-allowed"
    />
    <button
      type="button"
      onClick={() => setShowMap(true)}
      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black"
    >
      Choose
    </button>
  </div>
</div>


              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-black text-white rounded-xl text-lg font-bold hover:scale-105 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
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
