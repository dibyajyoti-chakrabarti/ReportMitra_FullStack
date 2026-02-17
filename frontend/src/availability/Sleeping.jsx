import { RefreshCw, Clock } from "lucide-react";
import ServerImage from "../assets/server-illustration.png"

export default function Sleeping({ onRetry }) {
  return (
    <>
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="min-h-screen lg:h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-6 lg:p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto lg:h-full lg:max-h-[90vh] flex items-center py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left side - Illustration */}
            <div 
              className="flex justify-center items-center"
              style={{ animation: "fadeUp 0.6s ease-out both" }}
            >
              <img 
                src={ServerImage}
                alt="Server maintenance" 
                className="w-full max-w-sm lg:max-w-lg drop-shadow-2xl"
                style={{ animation: "float 3s ease-in-out infinite" }}
              />
            </div>

            {/* Right side - Content */}
            <div className="flex flex-col justify-center space-y-5 lg:space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold self-center lg:self-start"
                style={{ animation: "fadeUp 0.7s ease-out both" }}
              >
                <Clock className="w-4 h-4" />
                Scheduled Maintenance
              </div>

              {/* Title */}
              <h1 
                className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight"
                style={{ animation: "fadeUp 0.8s ease-out both" }}
              >
                We'll Be Right Back
              </h1>

              {/* Description */}
              <p 
                className="text-base md:text-lg text-gray-600 leading-relaxed"
                style={{ animation: "fadeUp 0.9s ease-out both" }}
              >
                Our servers are taking a quick power nap to serve you better. We're performing routine maintenance to keep everything running smoothly.
              </p>

              {/* Time window */}
              <div 
                className="inline-block w-full"
                style={{ animation: "fadeUp 1s ease-out both" }}
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-4 rounded-xl shadow-lg">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="text-xs md:text-sm font-semibold opacity-90">Expected Uptime</div>
                      <div className="text-lg md:text-xl font-black">10:30 AM – 1:30 PM IST</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retry button */}
              {onRetry && (
                <div 
                  className="flex justify-center lg:justify-start"
                  style={{ animation: "fadeUp 1.1s ease-out both" }}
                >
                  <button
                    onClick={onRetry}
                    className="group bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Check Status
                  </button>
                </div>
              )}

              {/* Progress indicator */}
              <div 
                className="flex items-center justify-center lg:justify-start gap-2 text-xs md:text-sm text-gray-600"
                style={{ animation: "fadeUp 1.2s ease-out both" }}
              >
                <div 
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                ></div>
                <span className="font-semibold">System maintenance in progress</span>
              </div>

              {/* Footer */}
              <p 
                className="text-xs md:text-sm text-gray-500 pt-2"
                style={{ animation: "fadeUp 1.3s ease-out both" }}
              >
                © 2026 NagrikMitra • We appreciate your patience
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}