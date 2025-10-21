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
      <div className="absolute inset-0 brightness-40 -z-10">
        <GridDistortion
          imageSrc={bg_img}
          grid={80}
          mouse={0.03}
          strength={0.15}
          relaxation={0.9}
        />
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-16 text-center flex flex-col gap-10 justify-center">
        <h1 className="text-8xl font-bold mt-10">Welcome to ReportMitra</h1>

        <div className="font-bold text-4xl">
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

        {!isAuthenticated && (
          <div className="flex justify-center gap-10">
            <button
              onClick={handleLogin}
              className="bg-white font-bold text-black px-10 py-3 rounded-4xl hover:scale-110 hover:bg-black hover:text-white transition duration-200 text-4xl"
            >
              Get Started
            </button>
          </div>
        )}

        {/* How it works */}
        <section className="">
          <h2 className="text-3xl font-bold text-center mb-8">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Report */}
            <Link to="/report" className="relative hover:scale-105 transition cursor-pointer">
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6">
                <img src={report} alt="Report" className="w-16 h-16 rounded-full mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold mb-2">Report Issues</h3>
                <p>Easily report civic problems with photos and location details.</p>
              </div>
            </Link>

            {/* Track */}
            <Link to="/track" className="relative hover:scale-105 transition cursor-pointer">
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6 flex flex-col items-center">
                <div className="h-17 w-17 bg-white flex items-center rounded-full">
                  <img src={analysis} alt="Track" className="w-12 h-12 mx-auto" />
                </div>
                
                <h3 className="text-3xl font-extrabold mb-2">Track Progress</h3>
                <p>Monitor the status of your complaints in real-time.</p>
              </div>
            </Link>

            {/* Community */}
            <Link to="/community" className="relative hover:scale-105 transition cursor-pointer">
              <div className="absolute inset-0 bg-white text-black rounded-xl opacity-70"></div>
              <div className="relative text-black p-6">
                <img src={community} alt="Community" className="w-16 h-16 rounded-full mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold mb-2">Community Impact</h3>
                <p>See how your reports contribute to city improvement.</p>
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
