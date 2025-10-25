import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import Footer from "./Footer";

function Profile() {
  let firstName = "DEFAULT_VAL";
  let midName = "DEFAULT_VAL";
  let lastName = "DEFAULT_VAL";
  let age = "DEFAULT_VAL";
  let ph = "DEFAULT_VAL";
  let addr = "DEFAULT_VAL";
  let lastUpdated = "DEFAULT_VAL";
  let verified = "Not Verified";

  return (
    <div>
      <Navbar />

      <div className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Background */}
        <img
          src={report_bg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Main content box */}
        <div className="relative bg-white mt-24 mb-7 md:mt-20 w-[90vw] md:w-[80vw] min-h-[80vh] rounded-xl shadow-lg overflow-y-auto flex flex-col p-6 md:p-10 justify-center md:min-h-[70vh] lg:min-h-[60vh] lg:mt-30">
          {/* Title */}
          <h1 className="text-center font-extrabold text-3xl md:text-5xl mb-4">
            Profile
          </h1>

          {/* Note Section */}
          <div className="text-sm md:text-base leading-relaxed">
            <p>
              <b>
                <u>Note:</u>
              </b>{" "}
              To ensure authenticity and prevent misuse, all users must complete
              Aadhaar Verification before submitting complaints. Upon entering
              your Aadhaar Number, your basic details (Name, Age, and Phone
              Number) will be securely fetched from the official Aadhaar
              database. You will then receive a One-Time Password (OTP) on your
              registered mobile number to confirm your identity. We do not store
              or share your Aadhaar information beyond verification purposes.
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
                className="border px-3 py-2 rounded-md text-gray-700 w-60 md:w-72"
                placeholder="Enter Aadhaar Number"
              />
              <button className="text-sm md:text-base bg-black text-white px-4 py-2 rounded-3xl cursor-pointer hover:scale-105 transition">
                VERIFY
              </button>
              <span className="px-3 py-1 border-2 border-red-900 bg-red-400 text-red-950 rounded-md text-sm md:text-base font-semibold">
                {verified}
              </span>
            </div>
          </div>

          <hr className="my-4" />

          {/* Personal Details Section */}
          <div className="font-bold flex flex-col items-center justify-center">
            <p className="text-2xl md:text-3xl mb-4">Personal Details</p>

            <div className="flex flex-col gap-3 text-base md:text-xl w-full md:w-[80%]">
              <p>
                1. Full Name:{" "}
                <span className="text-gray-500">
                  {firstName} {midName} {lastName}
                </span>
              </p>
              <p>
                2. Age: <span className="text-gray-500">{age}</span>
              </p>
              <p>
                3. Registered Phone Number:{" "}
                <span className="text-gray-500">{ph}</span>
              </p>
              <p>
                4. Registered Address:{" "}
                <span className="text-gray-500">{addr}</span>
              </p>
              <p>
                5. Last Updated On:{" "}
                <span className="text-gray-500">{lastUpdated}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
