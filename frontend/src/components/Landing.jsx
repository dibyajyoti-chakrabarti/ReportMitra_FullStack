import { useAuth } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { 
  FileText, 
  BarChart3, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  TrendingUp,
  MapPin,
  Bell,
  Award,
  Clock,
  Target,
  Leaf
} from "lucide-react";
import CommunityImage from "../assets/community-illustration.png"
import TrackImage from "../assets/track-illustration.png"
import HeroImage from "../assets/hero-illustration.png"
import ReportImage from "../assets/report-illustration.png"

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const stats = [
    { number: "12,500+", label: "Issues Resolved", icon: CheckCircle },
    { number: "8,200+", label: "Active Citizens", icon: Users },
    { number: "3.2 Days", label: "Avg Resolution", icon: Clock },
    { number: "94%", label: "Success Rate", icon: Target },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Government-backed platform with end-to-end security for your data"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Tracking",
      description: "Monitor your complaint status from submission to resolution"
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get updates via SMS and email at every step of the process"
    },
    {
      icon: Award,
      title: "Proven Impact",
      description: "Join thousands of citizens making a real difference in Bangalore"
    }
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Leaf className="w-4 h-4" />
                Empowering Citizens Since 2026
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Your Voice.
                <br />
                <span className="text-emerald-600">Your City.</span>
                <br />
                Your Impact.
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Report civic issues, track progress in real-time, and join a community of citizens building a better Bangalore.
              </p>

              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <button
                    onClick={handleGetStarted}
                    className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm">No registration fee • Quick setup</span>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/report"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Report an Issue
                  </Link>
                  <Link
                    to="/track"
                    className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Track Status
                  </Link>
                </div>
              )}
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-green-200 rounded-3xl blur-2xl opacity-30"></div>
              {/* 
                ILLUSTRATION NEEDED: Hero community illustration
                - Storyset.com > Nature Illustrations > Simple Background
                - Colors: Green tones (#10B981, #059669, white)
                - Style: City/community scene with people collaborating
                - Save as: hero-illustration.png
              */}
              <img 
                src={HeroImage}
                alt="Community working together" 
                className="relative z-10 w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to make a real difference in your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Step 1: Report */}
            <div className="group relative">
              {isAuthenticated ? (
                <Link to="/report" className="block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      1
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      {/* 
                        ILLUSTRATION NEEDED: Report illustration
                        - Storyset.com > Nature Illustrations > Simple Background
                        - Colors: Green tones
                        - Style: Person with smartphone reporting an issue
                        - Save as: report-illustration.png
                      */}
                      <img 
                        src={ReportImage} 
                        alt="Report an issue" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Report Issue</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Snap a photo, add location, and describe the civic problem. Takes less than 2 minutes.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Start Reporting <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div onClick={handleGetStarted} className="block h-full cursor-pointer">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      1
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={ReportImage}
                        alt="Report an issue" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Report Issue</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Snap a photo, add location, and describe the civic problem. Takes less than 2 minutes.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Track */}
            <div className="group relative">
              {isAuthenticated ? (
                <Link to="/track" className="block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      2
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      {/* 
                        ILLUSTRATION NEEDED: Track illustration
                        - Storyset.com > Nature Illustrations > Simple Background
                        - Colors: Green tones
                        - Style: Analytics dashboard or progress tracking
                        - Save as: track-illustration.png
                      */}
                      <img 
                        src={TrackImage}
                        alt="Track progress" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Progress</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Monitor real-time updates as authorities review and work on resolving your complaint.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div onClick={handleGetStarted} className="block h-full cursor-pointer">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      2
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={TrackImage}
                        alt="Track progress" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Progress</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Monitor real-time updates as authorities review and work on resolving your complaint.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Community */}
            <div className="group relative">
              {isAuthenticated ? (
                <Link to="/community" className="block h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      3
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      {/* 
                        ILLUSTRATION NEEDED: Community illustration
                        - Storyset.com > Nature Illustrations > Simple Background
                        - Colors: Green tones
                        - Style: Group of diverse people collaborating
                        - Save as: community-illustration.png
                      */}
                      <img 
                        src={CommunityImage}
                        alt="Join community" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Community</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Connect with fellow citizens, share updates, and collectively drive positive change.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Community <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div onClick={handleGetStarted} className="block h-full cursor-pointer">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 h-full flex flex-col">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      3
                    </div>
                    
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={CommunityImage}
                        alt="Join community" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Community</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Connect with fellow citizens, share updates, and collectively drive positive change.
                      </p>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose JanSaathi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with transparency, security, and impact at its core
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6 group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of citizens who are actively shaping a better Bangalore. Your voice matters, and together we can create lasting change.
            </p>
            
            {!isAuthenticated && (
              <button
                onClick={handleGetStarted}
                className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 rounded-lg font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
              >
                Get Started for Free
                <ArrowRight className="w-6 h-6" />
              </button>
            )}

            {isAuthenticated && (
              <Link
                to="/report"
                className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 rounded-lg font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
              >
                <FileText className="w-6 h-6" />
                Report Your First Issue
              </Link>
            )}

            <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>8,200+ Active users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-600">Government<br />Verified</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-600">ISO<br />Certified</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-600">Digital India<br />Initiative</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-600">8K+ Active<br />Citizens</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;