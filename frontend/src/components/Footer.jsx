import logo from "../assets/logo-1.png";
import { MapPin, Mail, Heart, Shield, Users, CheckCircle, Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-emerald-50 text-gray-800 border-t border-emerald-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 flex-shrink-0 mr-3">
                <img src={logo} alt="ReportMitra logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-gray-900">ReportMitra</h2>
                <span className="text-[10px] font-semibold text-emerald-600 tracking-wide">CIVIC | CONNECT | RESOLVE</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Empowering citizens to make Bangalore cleaner, safer, and smarter — one report at a time.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-600 font-semibold">Active & Monitoring</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-emerald-500"></span>
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="/" className="hover:text-emerald-600 transition-colors duration-200 inline-block font-medium hover:translate-x-1 transition-transform">
                  Home
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-emerald-600 transition-colors duration-200 inline-block font-medium hover:translate-x-1 transition-transform">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="/track" className="hover:text-emerald-600 transition-colors duration-200 inline-block font-medium hover:translate-x-1 transition-transform">
                  Track Complaints
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-emerald-600 transition-colors duration-200 inline-block font-medium hover:translate-x-1 transition-transform">
                  Community Page
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-emerald-600 transition-colors duration-200 inline-block font-medium hover:translate-x-1 transition-transform">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-emerald-500"></span>
            </h3>
            <div className="space-y-4 text-gray-600">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">Bangalore, India</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <a href="mailto:support@reportmitra.in" className="hover:text-emerald-600 transition-colors duration-200 font-medium">
                  support@reportmitra.in
                </a>
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 mt-4">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">Secure Government Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-emerald-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-gray-600">Government<br />Verified</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-gray-600">ISO<br />Certified</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-gray-600">Digital India<br />Initiative</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-gray-600">8K+ Active<br />Citizens</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-100 mt-12 pt-6">
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm font-medium">
              © {new Date().getFullYear()} ReportMitra · Government of India · Ministry of Urban Development
            </p>
            <p className="text-gray-500 text-xs">
              All rights reserved · All activities are monitored for security
            </p>
            <div className="pt-3 border-t border-emerald-50 mt-4">
              <p className="text-gray-600 text-xs inline-flex items-center gap-2 justify-center">
                <span>Built with</span>
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>by BTech students at VIT Vellore</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
