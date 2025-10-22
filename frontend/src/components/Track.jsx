import Navbar from "./Navbar";
import report_bg from "../assets/reportbg.jpg";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

function Track() {
  const [active, setActive] = useState("details");
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
            Track Progress
          </div>
          <div className="px-15">
            <b>
              <u>Note: </u>
            </b>
            Enter your Tracking ID below to view the details and current status
            of your submitted complaint. You can access any enquiry using its
            unique Tracking ID — no login required. Please ensure you enter the
            exact ID provided at the time of submission.
            <div className="my-4"></div>
            <hr />
            <div className="flex justify-center text-2xl my-4">
              <div className="flex gap-10 font-bold">
                Tracking ID:
                <div className="flex items-center">
                  <input
                    type="text"
                    className="border px-2 py-1 text-gray-500 w-70"
                  />
                  <button className="text-[15px] underline cursor-pointer ml-5">
                    CHECK
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <div className="my-4">
              <nav className="flex gap-2 items-center justify-center font-bold">
                <div className="border-2 p-1 rounded-2xl">
                    <Link
                  to="details"
                  onClick={() => setActive("details")}
                  className={`px-2 py-1 ${
                    active === "details"
                      ? "bg-black text-white rounded-3xl"
                      : "bg-white text-black rounded-3xl"
                  }`}
                >
                  Issue Details
                </Link>
                <Link
                  to="action"
                  onClick={() => setActive("action")}
                  className={`px-2 py-1 ${
                    active === "action"
                      ? "bg-black text-white rounded-3xl"
                      : "bg-white text-black rounded-3xl"
                  }`}
                >
                  Actions Taken
                </Link>
                </div>
              </nav>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Track;
