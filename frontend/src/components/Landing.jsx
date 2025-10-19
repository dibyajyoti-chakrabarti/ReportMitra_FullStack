import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";
import GridDistortion from "../react-bits/GridDistortion";
import bg_img from "../assets/blr-infra-1.png";
import TextType from "../react-bits/TextType";
import Footer from './Footer'
import pencil from '../assets/pencilicon.png'

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  return (
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
                <Link
                  to="/login"
                  className="bg-white font-bold text-black px-6 py-3 rounded-lg hover:scale-110 hover:bg-black hover:text-white transition duration-200 inline-block text-3xl w-70"
                >
                  Get Started
                </Link>
                <Link
                  to="/signin"
                  className="bg-white font-bold text-black px-6 py-3 rounded-lg hover:scale-110 hover:bg-black hover:text-white transition duration-200 inline-block text-3xl w-70"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/report"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
                >
                  Report an Issue
                </Link>
                <Link
                  to="/track"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 inline-block"
                >
                  Track Complaints
                </Link>
              </div>
            )}

            {/* How it Works */}
            <section className="font-bold text-whit">
              <h2 className="text-3xl font-bold text-center mb-5">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">

                <div className="relative">
                  <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                  <div className="relative text-black p-4">
                    <div>
                      <span className="text-2xl">
                        <img src={pencil} alt="" className="bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" />
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
                </div>

                <div className="relative">
                  <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                  <div className="relative text-black p-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-2">
                      Track Progress
                    </h3>
                    <p className="e">
                      Monitor the status of your complaints in real-time.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 text-center p-6 bg-white text-black rounded-xl opacity-70"></div>
                  <div className="relative text-black p-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌆</span>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-2">
                      Community Impact
                    </h3>
                    <p className="e">
                      See how your reports contribute to city improvement.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default Landing;
