import { useState, useEffect } from "react";
import Navbar from "./MiniNavbar";
import report_bg from "../assets/reportbg.jpg";
import folder from "../assets/foldericon.png";
import { useAuth } from "../AuthProvider";
import Footer from "./Footer";
import Tick from "../assets/tick.png";
import Copy from "../assets/copy.jpg";

function Report() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // NEW
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW (optional)
  const [formData, setFormData] = useState({
    issue_title: "",
    location: "",
    issue_description: "",
    image_url: "",
  });

  const [userProfile, setUserProfile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const { user, getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch("http://localhost:8000/api/profile/", {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
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
      // keep formData.image_url empty - we'll set after upload
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
    // get auth headers if your app uses auth; otherwise remove getAuthHeaders()
    const authHeaders =
      typeof getAuthHeaders === "function" ? await getAuthHeaders() : {};

    // request presigned URL
    const presignResp = await fetch(
      "http://localhost:8000/api/reports/s3/presign/",
      {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      }
    );
    if (!presignResp.ok) {
      const err = await presignResp.text();
      throw new Error("Presign failed: " + err);
    }
    const { url: presignedUrl, key } = await presignResp.json();

    // upload the file using PUT
    const putResp = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putResp.ok) {
      const txt = await putResp.text();
      throw new Error("S3 upload failed: " + txt);
    }

    // construct object URL (private bucket) — store this in DB
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Start with existing image_url from formData (if any)
      let imageUrl = formData.image_url || "";

      // If there's a selected file, attempt S3 upload first
      if (selectedFile) {
        try {
          const { objectUrl } = await uploadFileToS3(selectedFile);
          imageUrl = objectUrl;
          console.log("Uploaded image URL:", imageUrl); // requirement: show in console
        } catch (uploadErr) {
          // If upload fails, report to console and user, and stop submit early
          console.error("Image upload error:", uploadErr);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return; // don't continue to submit report without a valid image
        }
      }

      // Prepare headers (support both function and static object)
      const headers =
        typeof getAuthHeaders === "function"
          ? await getAuthHeaders()
          : { "Content-Type": "application/json" };

      // Build payload including image_url (either uploaded or existing/blank)
      const payload = { ...formData, image_url: imageUrl };

      // Send report
      const response = await fetch("http://localhost:8000/api/reports/", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Try parse JSON error if possible, otherwise text
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

      // Success path: show popup and set application id
      const result = await response.json();
      console.log("Report submit result:", result);
      setApplicationId(result.id);
      setShowSuccessPopup(true);
      // alert("Report submitted!");

      // Reset form + file input + preview
      setFormData({
        issue_title: "",
        location: "",
        issue_description: "",
        image_url: "",
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Success Popup (overlay) */}
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

      {/* main area: background only covers the main; main grows to push footer down */}
      <main className="flex-grow relative flex justify-center py-8 md:py-12 lg:py-16">
        <img
          src={report_bg}
          alt=""
          className="absolute inset-0 object-cover w-full h-full -z-10"
        />

        {/* white card: responsive width + smooth height/padding transition */}
        <div
          className={`relative bg-white w-[90vw] md:w-[80vw] rounded-xl shadow-lg z-10
                      px-6 md:px-10 py-6 md:py-10 transition-all duration-300 ease-out`}
          style={{ willChange: "height, padding" }}
        >
          {/* Title */}
          <h1 className="text-center font-extrabold text-3xl md:text-5xl mb-6">
            Issue a Report
          </h1>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* User details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "First Name",
                  value: userProfile?.first_name || "Loading...",
                },
                {
                  label: "Middle Name",
                  value: userProfile?.middle_name || "N/A",
                },
                {
                  label: "Last Name",
                  value: userProfile?.last_name || "Loading...",
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

            {/* Issue details */}
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              {/* Left */}
              <div className="flex flex-col flex-1 font-bold space-y-2">
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
                  className="border px-3 py-2 rounded-md placeholder:text-gray-500 resize-none h-40 md:h-44 lg:h-60 2xl:h-66"
                />
              </div>

              {/* Right */}
              <div className="flex flex-col flex-1 font-bold space-y-2">
                <label>Issue Image</label>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <a
                    href="https://www.gov.wales/rural-grants-and-payments-geotagged-photo-guidance#121535"
                    className="underline text-sm text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NOTE: GEOTAGGED IMAGES ONLY
                  </a>

                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-white border-3 px-3 py-2 rounded-lg shadow hover:scale-105 transition flex items-center gap-2 text-3xl"
                  >
                    <img src={folder} alt="" className="h-7" />
                    Choose File
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="w-full bg-black h-40 lg:h-55 flex items-center justify-center rounded-md shadow 2xl:h-70 xl:h-64">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-contain w-full h-full rounded-md"
                    />
                  ) : (
                    <span className="text-white text-sm">
                      No Image Selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Bottom section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-2 font-bold">
                <label className="whitespace-nowrap">Issue Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter issue location"
                  required
                  className="border px-3 py-2 rounded-md w-full md:w-57 placeholder:text-gray-500 2xl:w-108"
                />
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
