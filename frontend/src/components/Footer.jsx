const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6 md:px-20">
        <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* Brand + Tagline */}
          <div>
            <h2 className="text-2xl font-bold mb-3">ReportMitra</h2>
            <p className="text-gray-400">
              Empowering citizens to make Bangalore cleaner, safer, and smarter — one report at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-white transition">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="/track" className="hover:text-white transition">
                  Track Complaints
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
            <p className="text-gray-400 mb-3">📍 Bangalore, India</p>
            <p className="text-gray-400 mb-3">📧 support@reportmitra.in</p>
            <div className="flex justify-center md:justify-start space-x-4 text-gray-400 text-2xl">
              <a href="#" className="hover:text-blue-400 transition">
                🌐
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                🐦
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                📘
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                📸
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ReportMitra. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
