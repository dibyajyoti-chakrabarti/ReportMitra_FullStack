import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { getApiUrl } from "../utils/api";

const Debug = () => {
  const { getToken, isAuthenticated, user } = useAuth();
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  if (import.meta.env.PROD) return null;

  const handleCopyToken = async () => {
    try {
      const token = await getToken();
      await navigator.clipboard.writeText(token);
      setStatus("Token copied to clipboard");
      if (import.meta.env.DEV) {
        console.log("KINDE TOKEN (dev only):", token);
      }
    } catch (e) {
      console.error(e);
      setStatus("Failed to get token");
    }
  };

  const handleFile = (e) => {
    setFile(e.target.files?.[0] || null);
    setStatus("");
  };

  const runE2E = async () => {
    if (!file) return setStatus("Pick a file first");
    setStatus("Getting token...");
    try {
      const token = await getToken();
      setStatus("Requesting presign...");
      const presignRes = await fetch(getApiUrl("/reports/s3/presign/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });
      if (!presignRes.ok)
        throw new Error(`presign failed ${presignRes.status}`);
      const { url, key } = await presignRes.json();

      setStatus("Uploading to S3...");
      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error(`S3 PUT failed ${putRes.status}`);

      setStatus("Creating report on backend...");
      const body = {
        reporter_first_name: user?.user_profile?.first_name || "Dev",
        reporter_last_name: user?.user_profile?.last_name || "Tester",
        issue_title: "E2E debug upload",
        location: "Dev Location",
        issue_description: "Created via DebugTokenEnhanced",
        image_url: key,
      };
      const createRes = await fetch(getApiUrl("/reports/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!createRes.ok) {
        const txt = await createRes.text();
        throw new Error(`create report failed: ${createRes.status} ${txt}`);
      }
      const created = await createRes.json();
      setStatus(`Done — report id ${created.id}`);
      if (import.meta.env.DEV) {
        console.log("Created report", created);
      }
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-80">
      <h3 className="font-bold mb-2 text-sm">
        Dev Debug (remove before commit)
      </h3>
      <div className="mb-2">
        <button
          onClick={handleCopyToken}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
        >
          Copy Token
        </button>
      </div>

      <div className="mb-2">
        <input onChange={handleFile} type="file" accept="image/*" />
      </div>

      <div className="mb-2">
        <button
          onClick={runE2E}
          disabled={!file}
          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm disabled:opacity-60"
        >
          Run presign → upload → create
        </button>
      </div>

      <div className="text-xs text-gray-300 mt-2">
        <div>Status: {status}</div>
        <div className="mt-1">Backend: {import.meta.env.VITE_BACKEND_URL}</div>
        <div className="mt-1">User: {user?.email}</div>
      </div>
    </div>
  );
};

export default Debug;
