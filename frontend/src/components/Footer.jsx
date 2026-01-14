import logo from "../assets/logo-1.png";
import { MapPin, Mail, Heart, BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 md:px-20 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src={logo} 
                alt="ReportMitra Logo" 
                className="w-12 h-12 mr-3 object-contain"
              />
              <h2 className="text-2xl font-bold">ReportMitra</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering citizens to make Bangalore cleaner, safer, and smarter — one report at a time.
            </p>
            <p className="text-xs text-gray-500 mt-4 uppercase tracking-wider font-semibold">
              CIVIC | CONNECT | RESOLVE
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors duration-200 inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-white transition-colors duration-200 inline-block">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="/track" className="hover:text-white transition-colors duration-200 inline-block">
                  Track Complaints
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-white transition-colors duration-200 inline-block">
                  Community Page
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-white transition-colors duration-200 inline-block">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Get in Touch</h3>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center justify-center md:justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Bangalore, India</span>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:support@reportmitra.in" className="hover:text-white transition-colors duration-200">
                  support@reportmitra.in
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                <a 
                  href="https://dibyajyoti-chakrabarti.vercel.app/projects/reportmitra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  Documentation
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start text-sm pt-2">
                <span className="text-gray-500">Secure government portal</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ReportMitra · Government of India · Ministry of Urban Development
            </p>
            <p className="text-gray-600 text-xs">
              All rights reserved · All activities are monitored
            </p>
            <p className="text-gray-700 text-xs pt-3 border-t border-white/5 mt-4 inline-flex items-center gap-1.5 px-4">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>by BTech students at VIT Vellore</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;