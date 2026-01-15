import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Navbar from "./MiniNavbar";
import Footer from "./Footer";
import { getApiUrl } from "../utils/api";

import {
  User,
  CreditCard,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

function Profile() {
  const { getAuthHeaders, user } = useAuth();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "Not Verified",
    midName: "",
    lastName: "",
    age: "Not Verified",
    dateOfBirth: "Not Verified",
    ph: "Not Verified",
    addr: "Not Verified",
    lastUpdated: "Not Verified",
    isVerified: false,
  });
  //Aadhaar from sandbox
  // TEST-ONLY Aadhaar numbers (DO NOT use real numbers)
const MOCK_AADHAAR_POOL =['900000000005', '900000000006', '900000000007', '900000000008', '900000000009', '900000000010', '900000000011', '900000000012', '900000000013', '900000000014', '900000000015', '900000000016', '900000000017', '900000000018', '900000000019', '900000000020', '900000000021', '900000000022', '900000000023', '900000000024', '900000000025', '900000000026', '900000000027', '900000000028', '900000000029', '900000000030', '900000000031', '900000000032', '900000000033', '900000000034', '900000000035', '900000000036', '900000000037', '900000000038', '900000000039', '900000000040', '900000000041', '900000000042', '900000000043', '900000000044', '900000000045', '900000000046', '900000000047', '900000000048', '900000000049', '900000000050', '900000000051', '900000000052', '900000000053', '900000000054', '900000000055', '900000000056', '900000000057', '900000000058', '900000000059', '900000000060', '900000000061', '900000000062', '900000000063', '900000000064', '900000000065', '900000000066', '900000000067', '900000000068', '900000000069', '900000000070', '900000000071', '900000000072', '900000000073', '900000000074', '900000000075', '900000000076', '900000000077', '900000000078', '900000000079', '900000000080', '900000000081', '900000000082', '900000000083', '900000000084', '900000000085', '900000000086', '900000000087', '900000000088', '900000000089', '900000000090', '900000000091', '900000000092', '900000000093', '900000000094', '900000000095', '900000000096', '900000000097', '900000000098'];
const getRandomUnusedAadhaar = () => {
  const used =
    JSON.parse(localStorage.getItem("used_mock_aadhaars")) || [];

  const unused = MOCK_AADHAAR_POOL.filter(
    (num) => !used.includes(num)
  );

  if (unused.length === 0) {
    alert("All test Aadhaar numbers are exhausted");
    return null;
  }

  const random =
    unused[Math.floor(Math.random() * unused.length)];

  return random;
};
const handleUseTestAadhaar = () => {
  const aadhaar = getRandomUnusedAadhaar();
  if (!aadhaar) return;

  setAadhaarNumber(String(aadhaar));
};





  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl("/profile/me/"), {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const profile = await response.json();

        const aadhaar = profile.aadhaar || null;

        const rawDob = aadhaar?.date_of_birth || null;
        const formattedDob = rawDob
          ? new Date(rawDob).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Not provided";

        const ageNumber = calculateAge(rawDob);
        const ageDisplay =
          ageNumber !== null ? `${ageNumber} years` : "Not provided";

        const phone = aadhaar?.phone_number || "Not provided";
        const address = aadhaar?.address || "Not provided";

        let firstName = aadhaar?.first_name || "";
        let middleName = aadhaar?.middle_name || "";
        let lastName = aadhaar?.last_name || "";

        if ((!firstName || !lastName) && aadhaar?.full_name) {
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

        const createdOrUpdated =
          profile.updated_at || profile.created_at || null;
        const formattedUpdated = createdOrUpdated
          ? new Date(createdOrUpdated).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Not provided";

        const isVerified = profile.is_aadhaar_verified || false;

        setProfileData({
          firstName: firstName || "Not provided",
          midName: middleName || "",
          lastName: lastName || "Not provided",
          age: ageDisplay,
          dateOfBirth: formattedDob,
          ph: phone,
          addr: address,
          lastUpdated: formattedUpdated,
          isVerified: isVerified,
        });

        if (isVerified && aadhaar?.aadhaar_number) {
          setVerificationResult({ verified: true });
          setAadhaarNumber(aadhaar.aadhaar_number);
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const verifyAadhaar = async () => {
    if (!aadhaarNumber) {
      alert("Please enter Aadhaar number");
      return;
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setIsVerifying(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl("/aadhaar/verify/"), {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhaar_number: aadhaarNumber }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response from server:", text);
        throw new Error("Server error - please try again later");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.detail || "Verification failed");
      }

      setVerificationResult(result);

      if (result.verified) {
        const used =
          JSON.parse(localStorage.getItem("used_mock_aadhaars")) || [];

        if (!used.includes(aadhaarNumber)) {
          localStorage.setItem(
            "used_mock_aadhaars",
            JSON.stringify([...used, aadhaarNumber])
          );
        }
        await loadProfileData();
        alert(
          "Aadhaar verification successful! Your profile has been updated."
        );
      } else {
        alert(
          "Aadhaar verification failed. Please check the number and try again."
        );
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationResult({
        verified: false,
        error: error.message || "Verification failed",
      });
      alert(`Verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(value);
  };

  const verified = profileData.isVerified ? "✓" : "Not Verified";

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700">
        <Loader2 className="h-14 w-14 animate-spin text-gray-900" />
        <p className="text-lg font-semibold tracking-wide">
          Loading your profile
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 flex justify-center py-8 md:py-12">
        <div
          className="bg-white w-full max-w-6xl rounded-2xl shadow-md
  px-4 sm:px-6 md:px-10 py-6 md:py-8"
        >
          <h1 className="text-center font-bold text-3xl md:text-4xl mb-4">
            Your Profile
          </h1>

          <div
            className="flex items-start gap-2 text-sm md:text-base
bg-gray-50 border rounded-lg p-4 mb-6"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 text-gray-600" />
            <p>
              <strong>Note:</strong> To ensure authenticity and prevent misuse,
              all users must complete Aadhaar verification before submitting
              complaints. Your basic details will be securely fetched from the
              Aadhaar database.
            </p>
          </div>

          <hr className="my-4" />

          <div className="border rounded-xl p-5 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-6">
              <div className="flex flex-wrap justify-center items-center gap-3">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <CreditCard className="w-5 h-5" />
                  Aadhaar Number
                </div>

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
                    ? "bg-green-700 text-white cursor-not-allowed"
                    : isVerifying
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:scale-105"
                }
              `}
                >
                  {isVerifying
                    ? "Verifying..."
                    : profileData.isVerified
                    ? "Verified"
                    : "Verify"}
                </button>
                    <button
                    type="button"
                    onClick={handleUseTestAadhaar}
                    disabled={profileData.isVerified}
                    className="text-xs px-3 py-1 rounded-lg border border-dashed border-gray-400 text-gray-600 hover:bg-gray-100"
                  >
                    Use Test Aadhaar
                  </button>

                {profileData.isVerified ? (
                  <CheckCircle className="w-7 h-7 text-green-700" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-red-600" />
                )}
              </div>
            </div>

            {verificationResult && (
              <div
                className={`text-center mb-4 text-sm ${
                  verificationResult.verified
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {verificationResult.verified
                  ? "✓ Aadhaar verified successfully! Your profile has been updated."
                  : verificationResult.error || "Aadhaar verification failed"}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-base">
              <div className="flex justify-between">
                <span className="w-1/3">Full Name:</span>
                <span className="text-gray-500 text-right w-2/3">
                  {profileData.firstName} {profileData.midName}{" "}
                  {profileData.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="w-1/3">Age:</span>
                <span className="text-gray-500 text-right w-2/3">
                  {profileData.age}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="w-1/3">Date of Birth:</span>
                <span className="text-gray-500 text-right w-2/3">
                  {profileData.dateOfBirth}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Phone:</span>
                <span className="text-gray-600 ml-auto">{profileData.ph}</span>
              </div>

              <div className="flex justify-between">
                <span className="w-1/3">Address:</span>
                <span className="text-gray-500 text-right w-2/3 whitespace-pre-line">
                  {profileData.addr}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="w-1/3">Last Updated:</span>
                <span className="text-gray-500 text-right w-2/3">
                  {profileData.lastUpdated}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="w-1/3">Aadhaar Status:</span>
                <span
                  className={`text-right w-2/3 font-semibold ${
                    profileData.isVerified ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {verified}
                </span>
              </div>
            </div>
          </div>

          {profileData.isVerified && (
            <div className="mt-8 p-4 bg-green-100 border-2 border-green-700 rounded-lg">
              <p className="text-green-700 text-center">
                <strong>Your profile is verified!</strong> <br />
                You can now submit reports.
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