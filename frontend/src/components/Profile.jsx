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
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import ProfileIllustration from "../assets/profile-illustration.png";

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
    trustScore: 100,
    deactivatedUntil: null,
    isTemporarilyDeactivated: false,
    incentiveRewardAmount: 0,
    incentiveRewardGranted: false,
    incentiveRewardValue: 50,
    incentiveTargetResolvedReports: 6,
    incentiveLatestReportsChecked: 0,
    incentiveLatestResolvedCount: 0,
    incentiveHasRequiredTrustScore: false,
    incentiveAllLatestReportsResolved: false,
    incentiveRewardJustGranted: false,
  });

  // TEST-ONLY Aadhaar numbers
  const MOCK_AADHAAR_POOL =['900000000005', '900000000006', '900000000007', '900000000008', '900000000009', '900000000010', '900000000011', '900000000012', '900000000013', '900000000014', '900000000015', '900000000016', '900000000017', '900000000018', '900000000019', '900000000020', '900000000021', '900000000022', '900000000023', '900000000024', '900000000025', '900000000026', '900000000027', '900000000028', '900000000029', '900000000030', '900000000031', '900000000032', '900000000033', '900000000034', '900000000035', '900000000036', '900000000037', '900000000038', '900000000039', '900000000040', '900000000041', '900000000042', '900000000043', '900000000044', '900000000045', '900000000046', '900000000047', '900000000048', '900000000049', '900000000050', '900000000051', '900000000052', '900000000053', '900000000054', '900000000055', '900000000056', '900000000057', '900000000058', '900000000059', '900000000060', '900000000061', '900000000062', '900000000063', '900000000064', '900000000065', '900000000066', '900000000067', '900000000068', '900000000069', '900000000070', '900000000071', '900000000072', '900000000073', '900000000074', '900000000075', '900000000076', '900000000077', '900000000078', '900000000079', '900000000080', '900000000081', '900000000082', '900000000083', '900000000084', '900000000085', '900000000086', '900000000087', '900000000088', '900000000089', '900000000090', '900000000091', '900000000092', '900000000093', '900000000094', '900000000095', '900000000096', '900000000097', '900000000098'];

  const getRandomUnusedAadhaar = () => {
    const used = JSON.parse(localStorage.getItem("used_mock_aadhaars")) || [];

    const unused = MOCK_AADHAAR_POOL.filter((num) => !used.includes(num));

    if (unused.length === 0) {
      alert("All test Aadhaar numbers are exhausted");
      return null;
    }

    const random = unused[Math.floor(Math.random() * unused.length)];

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
        const trustScore = profile.trust_score ?? 100;
        const isTemporarilyDeactivated =
          profile.is_temporarily_deactivated || false;
        const deactivatedUntil = profile.deactivated_until || null;
        const incentiveRewardAmount = profile.incentive_reward_amount ?? 0;
        const incentiveRewardGranted = profile.incentive_reward_granted || false;
        const incentiveRewardValue = profile.incentive_reward_value ?? 50;
        const incentiveTargetResolvedReports =
          profile.incentive_target_resolved_reports ?? 6;
        const incentiveLatestReportsChecked =
          profile.incentive_latest_reports_checked ?? 0;
        const incentiveLatestResolvedCount =
          profile.incentive_latest_resolved_count ?? 0;
        const incentiveHasRequiredTrustScore =
          profile.incentive_has_required_trust_score || false;
        const incentiveAllLatestReportsResolved =
          profile.incentive_all_latest_reports_resolved || false;
        const incentiveRewardJustGranted =
          profile.incentive_reward_just_granted || false;

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
          trustScore,
          isTemporarilyDeactivated,
          deactivatedUntil,
          incentiveRewardAmount,
          incentiveRewardGranted,
          incentiveRewardValue,
          incentiveTargetResolvedReports,
          incentiveLatestReportsChecked,
          incentiveLatestResolvedCount,
          incentiveHasRequiredTrustScore,
          incentiveAllLatestReportsResolved,
          incentiveRewardJustGranted,
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

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-700 bg-gradient-to-b from-emerald-50 to-white">
        <Loader2 className="h-14 w-14 animate-spin text-emerald-600" />
        <p className="text-lg font-semibold tracking-wide">
          Loading your profile...
        </p>
      </div>
    );
  }

  const incentiveProgress = Math.min(
    profileData.incentiveLatestResolvedCount,
    profileData.incentiveTargetResolvedReports
  );
  const incentiveProgressPercent =
    profileData.incentiveTargetResolvedReports > 0
      ? (incentiveProgress / profileData.incentiveTargetResolvedReports) * 100
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 px-6 md:px-10 py-8 md:py-12 text-white">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-3">
                  Your Profile
                </h1>
                <p className="text-lg md:text-xl text-emerald-50">
                  Manage your personal information and verification status
                </p>
              </div>
            </div>

            <div className="px-6 md:px-10 py-8 md:py-10">
              {/* Info Box */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-800">
                  <p className="font-semibold mb-1">Aadhaar Verification Required</p>
                  <p>
                    To ensure authenticity and prevent misuse, all users must
                    complete Aadhaar verification before submitting complaints. Your
                    basic details will be securely fetched from the Aadhaar database.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Trust Score
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {profileData.trustScore} / 110
                  </p>
                </div>
                {profileData.isTemporarilyDeactivated ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Account activates on{" "}
                    {new Date(profileData.deactivatedUntil).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Account Active
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-5 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Civic Incentive Reward
                    </p>
                    <h3 className="text-xl font-black text-amber-900 mt-1">
                      Earn Rs. {profileData.incentiveRewardValue} one-time
                    </h3>
                    <p className="text-sm text-amber-800 mt-2">
                      Keep trust score at 110 and make your latest{" "}
                      {profileData.incentiveTargetResolvedReports} reports resolved.
                    </p>
                  </div>
                  <div className="bg-white border border-amber-200 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-500 font-semibold uppercase">
                      Reward Wallet
                    </p>
                    <p className="text-2xl font-black text-gray-900 flex items-center gap-1">
                      <IndianRupee className="w-5 h-5 text-amber-600" />
                      {profileData.incentiveRewardAmount}
                    </p>
                  </div>
                </div>

                {!profileData.incentiveRewardGranted && (
                  <>
                    <div className="mt-4">
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${incentiveProgressPercent}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-amber-900 mt-3 font-semibold">
                      Resolved progress: {incentiveProgress} /{" "}
                      {profileData.incentiveTargetResolvedReports} (latest reports)
                    </p>
                    <p className="text-sm text-amber-900">
                      Trust score condition:{" "}
                      {profileData.incentiveHasRequiredTrustScore
                        ? "Passed"
                        : "Needs 110"}
                    </p>
                  </>
                )}

                {profileData.incentiveRewardGranted && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 font-semibold">
                    Reward unlocked. You received Rs. {profileData.incentiveRewardValue}
                    {profileData.incentiveRewardJustGranted
                      ? " for meeting this milestone."
                      : " from this milestone."}
                  </div>
                )}
              </div>

              {/* Verification Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  Aadhaar Verification
                </h2>

                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={handleAadhaarChange}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter 12-digit Aadhaar"
                        maxLength={12}
                        disabled={profileData.isVerified}
                      />
                      <button
                        onClick={verifyAadhaar}
                        disabled={isVerifying || profileData.isVerified}
                        className={`px-6 py-3 rounded-lg font-bold transition-all shadow-sm whitespace-nowrap ${
                          profileData.isVerified
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : isVerifying
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md"
                        }`}
                      >
                        {isVerifying ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                          </div>
                        ) : profileData.isVerified ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Verified
                          </div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>

                    {!profileData.isVerified && (
                      <button
                        type="button"
                        onClick={handleUseTestAadhaar}
                        className="mt-3 text-xs px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        Use Test Aadhaar (Development Only)
                      </button>
                    )}
                  </div>

                  {profileData.isVerified ? (
                    <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-6 py-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-green-700">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-orange-50 border-2 border-orange-200 px-6 py-3 rounded-full">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      <span className="font-bold text-orange-700">Not Verified</span>
                    </div>
                  )}
                </div>

                {verificationResult && !profileData.isVerified && (
                  <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {verificationResult.error || "Aadhaar verification failed"}
                  </div>
                )}
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Personal Details */}
              {profileData.isVerified ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-emerald-600" />
                    Personal Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">
                          Full Name
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {profileData.firstName} {profileData.midName}{" "}
                        {profileData.lastName}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">Age</span>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.age}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">
                          Date of Birth
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {profileData.dateOfBirth}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">Phone</span>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.ph}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">
                          Address
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium whitespace-pre-line">
                        {profileData.addr}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">
                          Last Updated
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {profileData.lastUpdated}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-700">
                          Verification Status
                        </span>
                      </div>
                      <p className="text-green-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-5 h-5" />
                        Verified
                      </p>
                    </div>
                  </div>

                  {/* Success Banner */}
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-green-900 text-lg mb-2">
                          Your profile is verified!
                        </h3>
                        <p className="text-green-800 mb-4">
                          You can now submit reports and track civic issues in your
                          community.
                        </p>
                        <a
                          href="/report"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Report an Issue
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unverified Empty State */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="max-w-md mx-auto">
                    {/* 
                      ILLUSTRATION NEEDED: Profile/Verification illustration
                      - Storyset.com > Business Illustrations > Simple Background
                      - Colors: Green tones (#10B981, #059669)
                      - Style: Person with ID card/verification shield
                      - Save as: profile-illustration.png
                    */}
                    <img
                      src={ProfileIllustration}
                      alt="Complete verification"
                      className="w-72 h-72 mx-auto mb-8 object-contain opacity-90"
                    />
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      Complete Your Verification
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Verify your Aadhaar above to unlock your full profile and start
                      reporting civic issues in your community.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
