import { useAuth } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import GridDistortion from "../react-bits/gridDistortion";
import bg_img from "../assets/blr-infra-1.png";
import TextType from "../react-bits/TextType";
import Footer from "./Footer";
import Navbar from "./Navbar";
import report from "../assets/reporticon.png";
import analysis from "../assets/analysisicon.png";
import community from "../assets/communityicon.jpg";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-x-hidden">
      <Navbar />

      <div
        className="fixed inset-0 -z-10 overflow-hidden brightness-40"
        style={{
          backgroundImage: `url(${bg_img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        <div className="fixed inset-0 w-full h-full pointer-events-none">
          <GridDistortion
            imageSrc={bg_img}
            grid={80}
            mouse={0.03}
            strength={0.15}
            relaxation={0.9}
          />
        </div>

        <img
          src={bg_img}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover object-top md:hidden"
        />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20 text-center flex flex-col gap-8 md:gap-10 justify-center pt-6 md:pt-12">
        <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mt-15 md:mt-12 leading-tight lg:mt-12">
          Welcome to ReportMitra
        </h1>

        <div className="font-bold text-lg sm:text-xl md:text-3xl lg:text-4xl px-1 md:px-4">
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
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white font-bold cursor-pointer text-black px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full hover:scale-105 hover:bg-black hover:text-white transition duration-200 text-lg sm:text-xl md:text-2xl"
            >
              Get Started
            </button>
          </div>
        )}

        <section className="mt-8 md:mt-12 w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-2 md:px-0 place-items-stretch">
            {isAuthenticated ? (
              <Link
                to="/report"
                className="relative w-full hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-90 rounded-xl "></div>
                <div className="relative text-black p-5 sm:p-6 md:p-8 flex flex-col items-center text-center h-full">
                  <img
                    src={report}
                    alt="Report"
                    className="w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-full"
                  />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
                    Report Issues
                  </h3>
                  <p className="text-sm sm:text-base md:text-base max-w-xs">
                    Easily report civic problems with photos and location details.
                  </p>
                </div>
              </Link>
            ) : (
              <div
                onClick={handleGetStarted}
                className="relative w-full hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-90 rounded-xl"></div>
                <div className="relative text-black p-5 sm:p-6 md:p-8 flex flex-col items-center text-center h-full">
                  <img
                    src={report}
                    alt="Report"
                    className="w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-full"
                  />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
                    Report Issues
                  </h3>
                  <p className="text-sm sm:text-base md:text-base max-w-xs">
                    Login required to report issues. Click to sign in.
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/track"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-90 rounded-xl"></div>
              <div className="relative text-black p-5 sm:p-6 md:p-8 flex flex-col items-center text-center h-full">
                <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white flex items-center justify-center mb-3  rounded-full">
                  <img src={analysis} alt="Track" className="w-7 h-7 sm:w-10 sm:h-10" />
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">Track Progress</h3>
                <p className="text-sm sm:text-base md:text-base max-w-xs">Monitor the status of your complaints in real-time.</p>
              </div>
            </Link>

            <Link
              to="/community"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer md:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-90 rounded-xl"></div>
              <div className="relative text-black p-5 sm:p-6 md:p-8 flex flex-col items-center text-center h-full ">
                <img src={community} alt="Community" className="w-14 h-14 sm:w-16 sm:h-16 mb-3  rounded-full" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">Community Impact</h3>
                <p className="text-sm sm:text-base md:text-base max-w-xs">See how your reports contribute to city improvement.</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <section className="w-full bg-black text-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-12 sm:gap-16">

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 sm:p-10 md:p-12 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-1 bg-blue-500"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              Our mission is to build a unified and transparent civic reporting platform that every
              citizen of Bengaluru can rely on. We want to remove the confusion around where and how
              to report issues, and provide a single, trusted destination for citizens to highlight
              civic problems.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              We aim to make reporting simple, eliminate unnecessary delays caused by manual routing,
              and ensure that every complaint reaches the correct department without friction. Through
              clear communication, accessible tools, and reliable tracking, ReportMitra empowers citizens
              to take meaningful action in improving their neighbourhoods.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              At its core, our mission is to strengthen the relationship between the people of Bengaluru
              and the systems that serve them — making civic participation easier, faster, and more impactful.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 sm:p-10 md:p-12 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-1 bg-blue-500"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Vision</h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              We envision a future where Bengaluru becomes a model for citizen-driven urban improvement.
              A city where everyone — from daily commuters to families to students — has the ability to
              report issues effortlessly, track real progress, and see visible outcomes in their community.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              Our vision is a Bengaluru where transparency is the norm, technology removes unnecessary
              barriers, and civic bodies and citizens work together with mutual trust. We believe that
              cleaner, safer, and smarter neighbourhoods can be achieved when citizens are empowered
              with the right tools and information.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              Ultimately, we aspire to build a city where civic problems don't accumulate silently but
              are acknowledged, addressed, and resolved with efficiency — shaping a more accountable and
              responsive urban environment for everyone.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 sm:p-10 md:p-12 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-1 bg-blue-500"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Why ReportMitra?</h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-gray-300">
              Civic issues in Bengaluru often go unresolved simply because citizens are unsure where to
              report them, which department is responsible, or whether their complaints will lead to any
              visible action. ReportMitra was created to bring clarity and confidence to this process.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              Through machine learning, every report is automatically classified and sent to the correct
              civic department — eliminating delays and reducing the dependency on manual decision-making.
              Our priority-based escalation model ensures long-pending issues receive increasing attention
              over time, even if the citizen does not repeatedly follow up.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              By giving residents a transparent way to track progress and stay informed, we aim to foster
              a culture where civic participation becomes easy, meaningful, and rewarding.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 mt-4">
              ReportMitra exists because Bengaluru deserves a system where every problem is heard, every
              voice matters, and every neighbourhood is valued.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;