import { useState } from "react";
import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import folder from '../assets/foldericon.png'

function Report() {
  const [preview, setPreview] = useState(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
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

        <div className="relative bg-white h-full w-[80vw] pt-20 z-10">
          {/* Title */}
          <div className="text-center font-extrabold text-5xl py-3">
            Issue a Report
          </div>

          {/* User Details */}
          <div className="flex justify-between w-full p-4">
            {["First Name", "Middle Name", "Last Name"].map((label) => (
              <div key={label} className="flex flex-col font-bold">
                {label}
                <input
                  type="text"
                  className="border px-2 py-1 placeholder:text-gray-500 w-50"
                  readOnly
                  placeholder="ABC"
                />
              </div>
            ))}

            <div className="flex flex-col font-bold">
              Issue Date
              <input
                type="date"
                className="border px-2 py-1 text-gray-500 w-50"
                readOnly
              />
            </div>
          </div>

          <hr />

          {/* Issue Description + Image */}
          <div className="flex mt-3 justify-center gap-10 mb-5">
            {/* Left side: title + description */}
            <div className="pl-4">
              <div className="flex flex-col font-bold">
                Issue Title
                <input
                  type="text"
                  className="border px-2 py-1 placeholder:text-gray-500 w-125 mb-3"
                  placeholder="Name the Issue"
                  required
                />
                Issue Description
                <textarea
                  className="border px-2 py-1 placeholder:text-gray-500 w-125 resize-none h-64"
                  required
                  placeholder="Describe the Issue in Detail"
                />
              </div>
            </div>

            {/* Right side: file upload + preview */}
            <div className="font-bold pl-7 flex flex-col">
              Issue Image
              <br />
              <div className="flex justify-between items-center gap-3 w-full min-w-[500px]">

                <a href="https://www.gov.wales/rural-grants-and-payments-geotagged-photo-guidance">
                  <u className="text-[15px]">Note: Geotagged Images Only</u>
                </a>
                <div className="">
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Label as custom button */}
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-white hover:scale-110 text-black border-3 items-center px-1 pr-2 py-2 rounded-lg shadow transition duration-200  ease-in-out flex"
                  >
                    <img src={folder} alt="" className="h-7 mr-1"/> Choose File
                  </label>
                </div>
              </div>
              Preview
              <div className="relative">
                <div className="absolute inset-0 w-125 h-63 object-contain bg-black shadow-md text-white  flex items-center justify-center text-4xl">No File Selected</div>
                {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="relative w-125 h-63 object-contain bg-black shadow-md"
                />
              )}
              </div>
              
            </div>
          </div>

          <hr />
          <div className="flex justify-between pt-1">
            <div className="flex gap-2 font-bold items-center">
              <div className="pl-5">Issue Location:</div>
              <input
                type="text"
                className="placeholder:text-gray-500 w-125"
                readOnly
                placeholder="Location"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1  rounded-xl text-2xl mr-10 bg-black text-white front-bold cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
