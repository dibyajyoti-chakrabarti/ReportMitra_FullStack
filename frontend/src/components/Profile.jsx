import { useState, useEffect } from "react";
import { useAuth } from '../AuthProvider';
import Navbar from "./MiniNavbar";
import report_bg from "../assets/reportbg.jpg";
import Footer from "./Footer";

function Profile() {
  const { getAuthHeaders, user } = useAuth();
  
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Not provided",
    midName: "Not provided", 
    lastName: "Not provided",
    age: "Not provided",
    dateOfBirth: "Not provided",
    ph: "Not provided",
    addr: "Not provided",
    lastUpdated: "Not provided",
    isVerified: false
  });

  // Load profile data when component mounts
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const profile = await response.json();
        
        // Format date for display
        const formattedDob = profile.date_of_birth 
          ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : "Not provided";
        
        setProfileData({
          firstName: profile.first_name || "Not provided",
          midName: profile.middle_name || "Not provided",
          lastName: profile.last_name || "Not provided",
          age: profile.age ? `${profile.age} years` : "Not provided",
          dateOfBirth: formattedDob,
          ph: profile.mobile_number || "Not provided",
          addr: profile.address || "Not provided",
          lastUpdated: profile.last_updated_at 
            ? new Date(profile.last_updated_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : "Not provided",
          isVerified: profile.is_aadhar_verified || false
        });

        // If already verified, set verification result and Aadhaar number
        if (profile.is_aadhar_verified && profile.aadhaar_number) {
          setVerificationResult({ verified: true });
          setAadhaarNumber(profile.aadhaar_number);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const verifyAadhaar = async () => {
    if (!aadhaarNumber) {
      alert("Please enter Aadhaar number");
      return;
    }

    // Validate Aadhaar number format (12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setIsVerifying(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/aadhaar/verify/`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaar_number: aadhaarNumber })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Server error - please try again later');
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.detail || 'Verification failed');
      }

      setVerificationResult(result);

      if (result.verified) {
        // Reload profile data to get updated information from backend
        await loadProfileData();
        alert("Aadhaar verification successful! Your profile has been updated.");
      } else {
        alert("Aadhaar verification failed. Please check the number and try again.");
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ 
        verified: false, 
        error: error.message || 'Verification failed' 
      });
      alert(`Verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAadhaarChange = (e) => {
    // Only allow numbers and limit to 12 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(value);
  };

  const verified = profileData.isVerified ? "✓" : "Not Verified";

  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* main content area with background */}
    <main className="flex-grow relative flex justify-center py-10 md:py-14 lg:py-16">
      <img
        src={report_bg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* white card container (fluid height) */}
      <div
        className="
          relative bg-white w-[90vw] md:w-[80vw] lg:w-[75vw]
           shadow-lg z-10
          px-6 md:px-10 py-8
          transition-all duration-300 ease-out
        "
      >
        {/* Title */}
        <h1 className="text-center font-extrabold text-3xl md:text-5xl mb-4">
          Profile
        </h1>

        {/* Note Section */}
        <div className="text-sm md:text-base leading-relaxed mb-6">
          <p>
            <b><u>Note:</u></b> To ensure authenticity and prevent misuse, all
            users must complete Aadhaar Verification before submitting complaints.
            Upon entering your Aadhaar Number, your basic details (Name, Age,
            Phone Number) will be securely fetched from the Aadhaar database.
          </p>
        </div>

        <hr className="my-4" />

        {/* Aadhaar Input Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-6">
          <div className="flex flex-wrap justify-center items-center gap-3">
            <label className="font-bold text-lg md:text-2xl whitespace-nowrap">
              Aadhaar Number
            </label>

            <input
              type="text"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              className="border px-3 py-2 rounded-md text-gray-700 w-60 md:w-72"
              placeholder="Enter 12-digit Aadhaar"
              maxLength={12}
              disabled={profileData.isVerified}
            />

            <button
              onClick={verifyAadhaar}
              disabled={isVerifying || profileData.isVerified}
              className={`
                text-sm md:text-base px-4 py-2 rounded-2xl cursor-pointer transition
                ${
                  profileData.isVerified
                    ? 'bg-green-700 text-white cursor-not-allowed'
                    : isVerifying
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-black text-white hover:scale-105'
                }
              `}
            >
              {isVerifying ? 'VERIFYING...' : profileData.isVerified ? 'VERIFIED' : 'VERIFY'}
            </button>

            <span
              className={`
                px-3 py-1 border-2 rounded-full text-sm md:text-base font-semibold
                ${
                  profileData.isVerified
                    ? 'border-green-700 bg-green-100 text-green-700 border-3'
                    : 'border-red-900 bg-red-400 text-red-950'
                }
              `}
            >
              {verified}
            </span>
          </div>
        </div>

        {/* Verification Status */}
        {verificationResult && (
          <div
            className={`text-center mb-4 text-sm ${
              verificationResult.verified ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {verificationResult.verified
              ? "✓ Aadhaar verified successfully! Your profile has been updated."
              : verificationResult.error || "Aadhaar verification failed"}
          </div>
        )}

        <hr className="my-4" />

        {/* Personal Details Section */}
        <div className="font-bold flex flex-col items-center justify-center">
          <p className="text-2xl md:text-3xl mb-6">Personal Details</p>

          <div className="flex flex-col gap-4 text-base md:text-xl w-full md:w-[80%]">
            <div className="flex justify-between">
              <span className="w-1/3">Full Name:</span>
              <span className="text-gray-500 text-right w-2/3">
                {profileData.firstName} {profileData.midName} {profileData.lastName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Age:</span>
              <span className="text-gray-500 text-right w-2/3">{profileData.age}</span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Date of Birth:</span>
              <span className="text-gray-500 text-right w-2/3">{profileData.dateOfBirth}</span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Phone Number:</span>
              <span className="text-gray-500 text-right w-2/3">{profileData.ph}</span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Address:</span>
              <span className="text-gray-500 text-right w-2/3 whitespace-pre-line">
                {profileData.addr}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Last Updated:</span>
              <span className="text-gray-500 text-right w-2/3">{profileData.lastUpdated}</span>
            </div>

            <div className="flex justify-between">
              <span className="w-1/3">Aadhaar Status:</span>
              <span
                className={`text-right w-2/3 font-semibold ${
                  profileData.isVerified ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {verified}
              </span>
            </div>
          </div>
        </div>

        {/* Verified Message */}
        {profileData.isVerified && (
          <div className="mt-8 p-4 bg-green-100 border-2 border-green-700 rounded-lg">
            <p className="text-green-700 text-center">
              <strong>Your profile is verified!</strong> <br />You can now submit reports.
            </p>
          </div>
        )}
      </div>
    </main>

    <Footer />
  </div>
);

}

export default Profile;