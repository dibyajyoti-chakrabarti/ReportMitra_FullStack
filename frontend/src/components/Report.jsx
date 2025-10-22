import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import folder from "../assets/foldericon.png";
import { useAuth } from "../AuthProvider";

function Report() {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    issue_title: "",
    location: "",
    issue_description: "",
    image_url: ""
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, getAuthHeaders } = useAuth();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: headers
        });
        
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, getAuthHeaders]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      // For now, we'll store the temporary URL
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
    } else {
      setPreview(null);
      setFormData(prev => ({ ...prev, image_url: "" }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/reports/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Report submitted successfully!');
        // Reset form
        setFormData({
          location: "",
          issue_description: "",
          image_url: ""
        });
        setPreview(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to submit report'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current date for issue date field
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div>
      <Navbar />
      <div className="relative h-[100vh] flex justify-center">
        <img
          src={report_bg}
          alt=""
          className="absolute inset-0 z-0 object-cover w-full h-full"
        />

        <div className="relative bg-white h-full w-[80vw] pt-20 z-10 overflow-y-auto">
          {/* Title */}
          <div className="text-center font-extrabold text-5xl py-3">
            Issue a Report
          </div>

          <div className="mx-15">
            {/* User Details */}
            <div className="flex justify-between w-full p-4">
              {[
                { label: "First Name", value: userProfile?.first_name || "Loading..." },
                { label: "Middle Name", value: userProfile?.middle_name || "Loading..." },
                { label: "Last Name", value: userProfile?.last_name || "Loading..." }
              ].map((field) => (
                <div key={field.label} className="flex flex-col font-bold">
                  {field.label}
                  <input
                    type="text"
                    className="border px-2 py-1 placeholder:text-gray-500 w-50"
                    readOnly
                    value={field.value}
                  />
                </div>
              ))}

              <div className="flex flex-col font-bold">
                Issue Date
                <input
                  type="date"
                  className="border px-2 py-1 text-gray-500 w-50"
                  readOnly
                  value={getCurrentDate()}
                />
              </div>
            </div>

            <hr />

            {/* Issue Description + Image */}
            <div className="flex mt-3 justify-center gap-10 mb-5">
              {/* Left side: description */}
              <div className="flex flex-col font-bold">
                Issue Title
                  <input
                    type="text"
                    name="issue_title"
                    className="border px-2 py-1 placeholder:text-gray-500 w-100 mb-3"
                    placeholder="Name the Issue"
                    value={formData.issue_title}
                    onChange={handleInputChange}
                    required
                  />
                Issue Description
                <textarea
                  name="issue_description"
                  value={formData.issue_description}
                  onChange={handleInputChange}
                  className="border px-2 py-1 placeholder:text-gray-500 w-100 resize-none h-63"
                  required
                  placeholder="Describe the Issue in Detail"
                />
              </div>

              {/* Right side: file upload + preview */}
              <div className="font-bold pl-7 flex flex-col">
                Issue Image
                <br />
                <div className="flex justify-between items-center gap-3 w-full">
                  <a href="https://www.gov.wales/rural-grants-and-payments-geotagged-photo-guidance#121535" className="whitespace-nowrap">
                    <u className="text-[15px]">NOTE: GEOTAGGED IMAGES ONLY</u>
                  </a>
                  <div className="">
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />

                    {/* Label as custom button */}
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer bg-white hover:scale-110 text-black border-3 items-center px-1 pr-2 py-2 rounded-lg shadow transition duration-200 ease-in-out flex whitespace-nowrap"
                    >
                      <img src={folder} alt="" className="h-6 mr-1" /> Choose File
                    </label>
                  </div>
                </div>
                Preview
                <div className="relative mt-2">
                  <div className={`w-125 h-63 bg-black shadow-md text-white flex items-center justify-center ${
                    preview ? 'hidden' : 'flex'
                  }`}>
                    No Image Selected
                  </div>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-125 h-63 object-contain bg-black shadow-md"
                    />
                  )}
                </div>
              </div>
            </div>

            <hr />
            <div className="flex justify-between pt-1 items-center">
              <div className="flex gap-2 font-bold items-center">
                <div className="pl-5">Issue Location:</div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="placeholder:text-gray-500 w-125 border px-2 py-1"
                  required
                  placeholder="Enter issue location"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1 rounded-xl text-2xl bg-black text-white front-bold cursor-pointer mr-3 disabled:opacity-50 hover:scale-105 transition-transform"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;