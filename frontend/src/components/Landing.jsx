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
    <div className="relative flex flex-col min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <DebugToken />

      {/* Background: fixed so it stays visible while page grows */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden brightness-40"
        style={{
          backgroundImage: `url(${bg_img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        {/* Keep GridDistortion fixed and full-screen so the effect covers the whole viewport */}
        <div className="fixed inset-0 w-full h-full pointer-events-none">
          <GridDistortion
            imageSrc={bg_img}
            grid={80}
            mouse={0.03}
            strength={0.15}
            relaxation={0.9}
          />
        </div>

        {/* Mobile fallback image (shows top of image on small screens) */}
        <img
          src={bg_img}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover object-top md:hidden"
        />
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 md:px-8 py-16 md:py-20 text-center flex flex-col gap-10 justify-center pt-8 md:pt-16">
        {/* Hero Text */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mt-6 leading-tight">
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
              className="bg-white font-bold cursor-pointer text-black px-8 sm:px-10 py-3 rounded-full hover:scale-105 hover:bg-black hover:text-white transition duration-200 text-2xl sm:text-3xl"
            >
              Get Started
            </button>
          </div>
        )}

        {/* How it works */}
        <section className="mt-12 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-8 place-items-stretch">
            {/* Report */}
            {isAuthenticated ? (
              <Link
                to="/report"
                className="relative w-full hover:scale-105 transition-transform cursor-pointer"
              >
                {/* rounded corners restored here for visual appeal */}
                <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-80 rounded-xl"></div>
                <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                  <img
                    src={report}
                    alt="Report"
                    className="w-16 h-16 sm:w-20 sm:h-20 mb-4"
                  />
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Report Issues</h3>
                  <p className="text-sm sm:text-base">
                    Easily report civic problems with photos and location details.
                  </p>
                </div>
              </Link>
            ) : (
              <div
                onClick={handleLogin}
                className="relative w-full hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-80 rounded-xl"></div>
                <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                  <img
                    src={report}
                    alt="Report"
                    className="w-16 h-16 sm:w-20 sm:h-20 mb-4"
                  />
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Report Issues</h3>
                  <p className="text-sm sm:text-base">Login required to report issues. Click to sign in.</p>
                </div>
              </div>
            )}

            {/* Track */}
            <Link
              to="/track"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-80 rounded-xl"></div>
              <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white flex items-center justify-center mb-4">
                  <img src={analysis} alt="Track" className="w-8 h-8 sm:w-12 sm:h-12" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Track Progress</h3>
                <p className="text-sm sm:text-base">Monitor the status of your complaints in real-time.</p>
              </div>
            </Link>

            {/* Community */}
            <Link
              to="/community"
              className="relative w-full hover:scale-105 transition-transform cursor-pointer md:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-white text-black border border-gray-200 opacity-80 rounded-xl"></div>
              <div className="relative text-black p-6 sm:p-8 flex flex-col items-center text-center h-full">
                <img src={community} alt="Community" className="w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Community Impact</h3>
                <p className="text-sm sm:text-base">See how your reports contribute to city improvement.</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* ABOUT SECTION (stacked cards on black background, no rounding) */}
      <section className="w-full bg-black text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {/* Mission */}
          <div className="bg-[#0D1117] p-14 border border-gray-800 shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
            <div className="h-1 w-24 bg-[#2563EB] mb-8"></div>

            <p className="text-xl leading-relaxed text-gray-300">
              Our mission is to build a unified and transparent civic reporting platform that every
              citizen of Bengaluru can rely on. We want to remove the confusion around where and how
              to report issues, and provide a single, trusted destination for citizens to highlight
              civic problems.
              <br />
              <br />
              We aim to make reporting simple, eliminate unnecessary delays caused by manual routing,
              and ensure that every complaint reaches the correct department without friction. Through
              clear communication, accessible tools, and reliable tracking, ReportMitra empowers citizens
              to take meaningful action in improving their neighbourhoods.
              <br />
              <br />
              At its core, our mission is to strengthen the relationship between the people of Bengaluru
              and the systems that serve them — making civic participation easier, faster, and more impactful.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#0D1117] p-14 border border-gray-800 shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
            <div className="h-1 w-24 bg-[#2563EB] mb-8"></div>

            <p className="text-xl leading-relaxed text-gray-300">
              We envision a future where Bengaluru becomes a model for citizen-driven urban improvement.
              A city where everyone — from daily commuters to families to students — has the ability to
              report issues effortlessly, track real progress, and see visible outcomes in their community.
              <br />
              <br />
              Our vision is a Bengaluru where transparency is the norm, technology removes unnecessary
              barriers, and civic bodies and citizens work together with mutual trust. We believe that
              cleaner, safer, and smarter neighbourhoods can be achieved when citizens are empowered
              with the right tools and information.
              <br />
              <br />
              Ultimately, we aspire to build a city where civic problems don’t accumulate silently but
              are acknowledged, addressed, and resolved with efficiency — shaping a more accountable and
              responsive urban environment for everyone.
            </p>
          </div>

          {/* Why ReportMitra */}
          <div className="bg-[#0D1117] p-14 border border-gray-800 shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Why ReportMitra?</h2>
            <div className="h-1 w-32 bg-[#2563EB] mb-8"></div>

            <p className="text-xl leading-relaxed text-gray-300">
              Civic issues in Bengaluru often go unresolved simply because citizens are unsure where to
              report them, which department is responsible, or whether their complaints will lead to any
              visible action. ReportMitra was created to bring clarity and confidence to this process.
              <br />
              <br />
              Through machine learning, every report is automatically classified and sent to the correct
              civic department — eliminating delays and reducing the dependency on manual decision-making.
              Our priority-based escalation model ensures long-pending issues receive increasing attention
              over time, even if the citizen does not repeatedly follow up.
              <br />
              <br />
              By giving residents a transparent way to track progress and stay informed, we aim to foster
              a culture where civic participation becomes easy, meaningful, and rewarding.
              <br />
              <br />
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
