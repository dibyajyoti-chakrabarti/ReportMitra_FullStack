import server_down_image from '../assets/server-down.svg'

export default function Sleeping({ onRetry }) {
  return (
    <>
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

      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
        <div
          className="
            w-full max-w-[min(860px,100%)]
            max-h-[100vh]
            bg-white
            rounded-2xl sm:rounded-[22px]
            shadow-[0_16px_48px_rgba(0,0,0,0.1)]
            text-center
            px-4 sm:px-8 md:px-12
            py-6 sm:py-10 md:py-12
            flex flex-col
            justify-center
            overflow-hidden
          "
          style={{ animation: "fadeUp 0.8s ease-out both" }}
        >
          <img
            src={server_down_image}
            alt="Server temporarily unavailable"
            className="
              w-full max-w-[clamp(180px,50vw,360px)]
              mx-auto
              mb-4 sm:mb-6 md:mb-8
              drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]
            "
            style={{ animation: "float 3.5s ease-in-out infinite" }}
          />

          <h1
            className="
              font-bold
              text-slate-900
              tracking-tight
              mb-3 sm:mb-4
              text-[clamp(20px,5vw,36px)]
              leading-tight
            "
            style={{ animation: "fadeUp 0.9s ease-out both" }}
          >
            Our servers are currently sleeping
          </h1>

          <p
            className="
              text-slate-600
              leading-relaxed
              max-w-[560px]
              mx-auto
              mb-4 sm:mb-6
              text-[clamp(13px,2.5vw,16px)]
              px-2
            "
            style={{ animation: "fadeUp 1s ease-out both" }}
          >
            We're doing a quick wake-up routine on our backend systems.
            Please check back during the window below.
          </p>

          <div
            className="
              inline-block
              px-4 sm:px-6 md:px-8
              py-2 sm:py-3
              rounded-xl sm:rounded-2xl
              font-bold
              text-blue-600
              bg-blue-600/10
              text-[clamp(12px,2.5vw,15px)]
              mb-4 sm:mb-6
            "
            style={{ animation: "pulse 2.8s ease-in-out infinite" }}
          >
            10:30 AM – 1:30 PM IST
          </div>

          {onRetry && (
            <div className="mb-4 sm:mb-6">
              <button
                onClick={onRetry}
                className="
                  inline-flex items-center justify-center
                  rounded-md
                  bg-slate-900
                  text-white
                  px-5 sm:px-6
                  py-2
                  text-[13px] sm:text-sm
                  font-medium
                  hover:bg-slate-800
                  active:bg-slate-700
                  transition
                "
              >
                Retry
              </button>
            </div>
          )}

          <footer
            className="
              text-[11px] sm:text-[12px]
              text-slate-500
            "
            style={{ animation: "fadeUp 1.1s ease-out both" }}
          >
            © 2026 ReportMitra
          </footer>
        </div>
      </div>
    </>
  );
}