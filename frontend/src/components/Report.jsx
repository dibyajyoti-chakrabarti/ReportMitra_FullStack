import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import folder from "../assets/foldericon.png";
import { useAuth } from "../AuthProvider";
import Footer from './Footer'

function Report() {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    issue_title: "",
    location: "",
    issue_description: "",
    image_url: "",
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFormData((p) => ({ ...p, image_url: imageUrl }));
    } else {
      setPreview(null);
      setFormData((p) => ({ ...p, image_url: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch("http://localhost:8000/api/reports/", {
        method: "POST",
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setApplicationId(result.id);
        setShowSuccessPopup(true);
        
        // Reset form
        setFormData({
          issue_title: "",
          location: "",
          issue_description: "",
          image_url: "",
        });
        setPreview(null);
        document.getElementById("fileInput").value = "";
      } else {
        const err = await response.json();
        alert(`Error: ${err.detail || "Failed to submit report"}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report. Please try again.");
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
    <div>
      <Navbar />
  {/* Success Popup */}
  {showSuccessPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Report Submitted Successfully!
        </h2>
        
        <p className="text-gray-600 mb-4">
          Your report has been submitted and is now under review.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Application ID for tracking:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="bg-white px-3 py-2 rounded border text-lg font-mono font-bold text-blue-700">
              {applicationId}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={closePopup}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue
          </button>
          <button
            onClick={() => {
              closePopup();
              // Navigate to the specific report detail page
              window.location.href = `/track/detail/`;
            }}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            Track this report →
          </button>
        </div>
      </div>
    </div>
  )}
      <div className="relative flex items-center justify-center h-auto md:min-h-240 lg:min-h-260 ">
        <img
          src={report_bg}
          alt=""
          className="absolute inset-0 object-cover w-full h-full -z-10"
        />

        {/* White container fills most of the screen height */}
        <div className="relative bg-white mt-22 md:mt-23 mb-5 w-[90vw] md:w-[80vw] min-h-[89vh] md:min-h-[69vh] rounded-xl shadow-lg overflow-y-scroll flex flex-col justify-start p-6 md:p-10 lg:mt-15 lg:mb-0 lg:min-h-[40vh]">

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
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="w-full bg-black h-40 lg:h-55 flex items-center justify-center rounded-md shadow 2xl:h-70">
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
      </div>
      <Footer/>
    </div>
  );
}

export default Report;