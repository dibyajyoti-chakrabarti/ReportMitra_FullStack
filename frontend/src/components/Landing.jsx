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
    <div className="relative">
    <Navbar/>

    {/* REMOVE FOR DEPLOYMENT */}
    <DebugToken/>
    
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full overflow-x-hidden text-white flex items-start flex-grow">
        {/* Background component from React-Bits */}
        <div className="absolute inset-0 brightness-40">
          <GridDistortion
            imageSrc={bg_img}
            grid={80}
            mouse={0.03}
            strength={0.15}
            relaxation={0.9}
            className="custom-class"
          />
        </div>
        {/* Content on Background */}
        <main className="relative container mx-auto px-4 py-8 ">
          <section className="text-center py-16 flex flex-col gap-10">
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

              {!isAuthenticated ? (
                <div className="space-x-4 flex gap-10 justify-center">
                  <button
                    onClick={handleLogin}
                    className="bg-white font-bold text-black px-10 py-3 rounded-4xl hover:scale-110 hover:bg-black hover:text-white transition duration-200 inline-block text-4xl cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <></>
              )}

              {/* How it Works */}
              <section className="font-bold text-whit">
                <h2 className="text-3xl font-bold text-center mb-5">
                  How It Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  <Link
                    to="/report"
                    className="relative hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                    <div className="relative text-black p-4">
                      <div>
                        <span className="text-2xl">
                          <img
                            src={report}
                            alt=""
                            className="bg-transparent w-17 h-17 rounded-full flex items-center justify-center mx-auto mb-4"
                          />
                        </span>
                      </div>
                      <h3 className="text-3xl font-extrabold mb-2">
                        Report Issues
                      </h3>
                      <p className="e">
                        Easily report civic problems with photos and location
                        details.
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/track"
                    className="relative hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                    <div className="relative text-black p-4">
                      <div>
                        <span className="text-2xl rounded-full bg-white w-17 h-17 flex items-center justify-center mx-auto mb-4">
                          <img src={analysis} alt="" className="w-12 h-12" />
                        </span>
                      </div>
                      <h3 className="text-3xl font-extrabold mb-2">
                        Track Progress
                      </h3>
                      <p className="e">
                        Monitor the status of your complaints in real-time.
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/community"
                    className="relative hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                    <div className="relative text-black p-4">
                      <div className="  flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">
                          <img
                            src={community}
                            alt=""
                            className="
                        w-16 h-16 rounded-full"
                          />
                        </span>
                      </div>
                      <h3 className="text-3xl font-extrabold mb-2">
                        Community Impact
                      </h3>
                      <p className="e">
                        See how your reports contribute to city improvement.
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
