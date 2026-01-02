import { useEffect, useState, useCallback } from "react";

const HEALTH_ENDPOINT = "/api/health";
const TIMEOUT_MS = 3000;

export function useBackendHealth() {
  const [status, setStatus] = useState("checking");

  const checkHealth = useCallback(async () => {
    setStatus("checking");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(HEALTH_ENDPOINT, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status < 500) {
        setStatus("up");
      } else {
        setStatus("down");
      }
    } catch (err) {
      clearTimeout(timeout);
      // Silently handle - this is expected when backend is down
      setStatus("down");
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    status,
    retry: checkHealth,
  };
}
