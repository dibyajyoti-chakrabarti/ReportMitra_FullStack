import { useOutletContext } from "react-router-dom";

function IssueAction() {
  const [reportData] = useOutletContext();
  const trackingID = reportData?.tracking_id || "Fetching Data...";
  const status = reportData?.status
    ? reportData.status.replace("_", " ").toUpperCase()
    : "Fetching Data...";
  const dept = reportData?.department || "Fetching Data...";
  const ackDate = reportData?.issue_date
    ? new Date(reportData.issue_date).toLocaleDateString()
    : "Fetching Data...";
  const resolutionDate = "Pending";
  const comments = `Report is currently ${
    reportData?.status || "pending"
  }. Our team will review and take appropriate action.`;
  const escalated = reportData?.status === "in_progress" ? "Yes" : "No";

  return (
    <div className="flex flex-col lg:flex-row border-2 border-dashed border-gray-400 mt-3 rounded-xl shadow-sm">

      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 p-4 lg:p-3 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-gray-400">
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Tracking ID: </span> {trackingID}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Current Status: </span> {status}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Escalated?: </span> {escalated}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Department: </span> {dept}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Date of Acknowledgement: </span> {ackDate}
        </div>
        <div className="text-base sm:text-lg lg:text-[17px]">
          <span className="font-bold">Date of Resolution: </span>{" "}
          {resolutionDate}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-3">
        <p className="font-bold text-lg lg:text-[17px] mb-2 text-center">
          Comments from Department
        </p>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-3 text-base sm:text-lg lg:text-[17px] overflow-y-auto max-h-56 shadow-inner">
          {comments}
        </div>
      </div>
    </div>
  );
}

export default IssueAction;
