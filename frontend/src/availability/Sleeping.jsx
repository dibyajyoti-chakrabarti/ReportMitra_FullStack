// frontend/src/availability/Sleeping.jsx
import server_down_image from '../assets/server-down.svg'

export default function Sleeping({ onRetry }) {
  return (
    <>
      {/* Component-scoped animations (mirrors original CSS) */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
            100% { transform: translateY(0); }
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.28);
            }
            70% {
              box-shadow: 0 0 0 14px rgba(37, 99, 235, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* Viewport */}
      <div className="min-h-[100svh] bg-slate-50 flex justify-center items-start px-4 sm:px-8 overflow-x-hidden overflow-y-auto">
        <div
          className="
            w-full max-w-[860px]
            bg-white
            rounded-[22px]
            shadow-[0_32px_64px_rgba(0,0,0,0.12)]
            text-center
            px-6 sm:px-10 md:px-16
            py-10 sm:py-14 md:py-20
            my-auto
          "
          style={{ animation: "fadeUp 0.8s ease-out both" }}
        >
          {/* Hero image */}
          <img
            src={server_down_image}
            alt="Server temporarily unavailable"
            className="
              w-full max-w-[460px]
              mx-auto
              mb-8 sm:mb-10 md:mb-12
              drop-shadow-[0_14px_20px_rgba(0,0,0,0.12)]
            "
            style={{ animation: "float 3.5s ease-in-out infinite" }}
          />

          {/* Heading */}
          <h1
            className="
              font-bold
              text-slate-900
              tracking-tight
              mb-4
              text-[clamp(26px,4vw,42px)]
            "
            style={{ animation: "fadeUp 0.9s ease-out both" }}
          >
            Our servers are currently sleeping
          </h1>

          {/* Description */}
          <p
            className="
              text-slate-500
              leading-relaxed
              max-w-[640px]
              mx-auto
              text-[clamp(15px,2.3vw,18px)]
            "
            style={{ animation: "fadeUp 1s ease-out both" }}
          >
            We’re doing a quick wake-up routine on our backend systems.
            Please check back during the window below.
          </p>

          {/* Time box */}
          <div
            className="
              inline-block
              mt-8 sm:mt-10
              px-8 py-4
              rounded-2xl
              font-bold
              text-blue-600
              bg-blue-600/10
              text-[clamp(14px,2vw,16px)]
            "
            style={{ animation: "pulse 2.8s ease-in-out infinite" }}
          >
            10:30 AM – 12:30 PM IST
          </div>

          {/* Retry button (optional but wired) */}
          {onRetry && (
            <div className="mt-8">
              <button
                onClick={onRetry}
                className="
                  inline-flex items-center justify-center
                  rounded-md
                  bg-slate-900
                  text-white
                  px-6 py-2
                  text-sm font-medium
                  hover:bg-slate-800
                  transition
                "
              >
                Retry
              </button>
            </div>
          )}

          {/* Footer */}
          <footer
            className="
              mt-10 sm:mt-12
              text-[13px]
              text-slate-500
            "
            style={{ animation: "fadeUp 1.1s ease-out both" }}
          >
            © 2025 ReportMitra
          </footer>
        </div>
      </div>
    </>
  );
}
