import { useBackendHealth } from "./useBackendHealth";
import Sleeping from "./Sleeping";

export default function BackendGate({ children }) {
  const { status, retry } = useBackendHealth();

  if (import.meta.env.MODE === "development") {
    console.log("Backend status:", status);
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Checking server status…</p>
        </div>
      </div>
    );
  }

  if (status === "down") {
    return <Sleeping onRetry={retry} />;
  }

  return <>{children}</>;
}