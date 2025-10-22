import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
function Profile() {
  let firstName = "DEFAULT_VAL";
  let midName = "DEFAULT_VAL";
  let lastName = "DEFAULT_VAL";
  let age = "DEFAULT_VAL";
  let ph = "DEFAULT_VAL";
  let addr = "DEFAULT_VAL";
  let lastUpdated = "DEFAULT_VAL";
  let verified='Not Verified'
  return (
    <div>
      <Navbar />
      <div className="relative h-[100vh] flex justify-center">
        <img
          src={report_bg}
          alt=""
          className="absolute inset-0 z-0 object-cover w-full h-full"
        />
        <div className="relative bg-white h-full w-[80vw] pt-20 z-10">
          <div className="text-center font-extrabold text-5xl py-3">
            Profile
          </div>
          <div className="px-15">
            <b>
              <u>Note: </u>
            </b>
            To ensure authenticity and prevent misuse, all users must complete
            Aadhaar Verification before submitting complaints. Upon entering
            your Aadhaar Number, your basic details (Name, Age, and Phone
            Number) will be securely fetched from the official Aadhaar database.
            You will then receive a One-Time Password (OTP) on your registered
            mobile number to confirm your identity. We do not store or share
            your Aadhaar information beyond verification purposes.
            <div className="my-4"></div>
            <hr />
            <div className="flex justify-center text-2xl my-4">
              <div className="flex gap-10 font-bold items-center">
                Aadhaar Number:
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border px-2 py-1 text-gray-500 w-70"
                  />
                  <button className="text-[15px] bg-black text-white px-2 py-2 rounded-3xl cursor-pointer ml-5 hover:scale-110">
                    VERIFY
                  </button>
                <span className="ml-10 px-2 text-[15px] border-2 border-red-900 bg-red-400 text-red-950">{verified}</span>
                </div>
              </div>
            </div>
            <hr />
            <div className="my-4 font-bold flex flex-col">
              <p className="text-3xl text-center mb-4">Personal Details</p>
              <div className="flex flex-col gap-2">
                <div className="text-xl">
                  1. Full Name:{" "}
                  <span className="text-gray-500">
                    {firstName} {midName} {lastName}
                  </span>
                </div>
                <div className="text-xl">
                  2. Age: <span className="text-gray-500">{age}</span>
                </div>
                <div className="text-xl">
                  3. Registered Phone Number:{" "}
                  <span className="text-gray-500">{ph}</span>
                </div>
                <div className="text-xl">
                  4. Registered Address:{" "}
                  <span className="text-gray-500">{addr}</span>
                </div>
                <div className="text-xl">
                  5. Last Updated On:{" "}
                  <span className="text-gray-500">{lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
