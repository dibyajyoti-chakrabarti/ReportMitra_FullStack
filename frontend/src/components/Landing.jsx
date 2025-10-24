import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";
import GridDistortion from "../react-bits/gridDistortion";
import bg_img from "../assets/blr-infra-1.png";
import TextType from "../react-bits/TextType";
import Footer from "./Footer";
import Navbar from "./Navbar";
import report from "../assets/reporticon.png";
import analysis from "../assets/analysisicon.png";
import community from "../assets/communityicon.jpg";
import DebugToken from "./Debug";

const Landing = () => {
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      <Navbar />
      <DebugToken />

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden brightness-40">
        <div className="w-full h-full">
          <GridDistortion
            imageSrc={bg_img}
            grid={80}
            mouse={0.03}
            strength={0.15}
            relaxation={0.9}
          />
        </div>

        {/* Overlay responsive image fallback for mobile */}
        <img
          src={bg_img}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-16 text-center flex flex-col gap-10 justify-center">
        {/* Hero Text */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mt-10 leading-tight">
          Welcome to ReportMitra
        </h1>

        <div className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl px-2">
          <TextType
            text={[
              "Report issues instantly",
              "Make Bangalore cleaner",
              "Your voice matters",
              "Help shape your city",
              "Every complaint counts",
              "Small actions, big impact",
              "Together for a better Bangalore",
              "Be the change",
              "Happy citizens, happy city",
              "Track complaints like a pro",
              "No pothole too small",
              "Make noise, get results",
            ]}
            typingSpeed={50}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="."
          />
        </div>

        {/* Get Started Button */}
        {!isAuthenticated && (
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-white font-bold cursor-pointer text-black px-8 sm:px-10 py-3 rounded-full hover:scale-110 hover:bg-black hover:text-white transition duration-200 text-2xl sm:text-3xl"
            >
              Get Started
            </button>
          </div>
        )}

        {/* How it works */}
        {/* How it works */}
        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            How It Works
          </h2>

          {/* Responsive grid:
      - mobile: 1 column
      - md (tablet/iPad): 2 columns (report + track top, community full width below)
      - lg (desktop): 3 columns
  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 md:px-8 place-items-stretch">
            {/* Report */}
            <Link
              to="/report"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                <img
                  src={report}
                  alt="Report"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4"
                />
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Report Issues
                </h3>
                <p className="text-sm sm:text-base">
                  Easily report civic problems with photos and location details.
                </p>
              </div>
            </Link>

            {/* Track */}
            <Link
              to="/track"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white flex items-center justify-center rounded-full mb-4">
                  <img
                    src={analysis}
                    alt="Track"
                    className="w-8 h-8 sm:w-12 sm:h-12"
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Track Progress
                </h3>
                <p className="text-sm sm:text-base">
                  Monitor the status of your complaints in real-time.
                </p>
              </div>
            </Link>

            {/* Community -> will span both columns on md (tablet) and be single column on mobile and normal 3rd column on lg */}
            <Link
              to="/community"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer md:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                <img
                  src={community}
                  alt="Community"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4"
                />
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Community Impact
                </h3>
                <p className="text-sm sm:text-base">
                  See how your reports contribute to city improvement.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
