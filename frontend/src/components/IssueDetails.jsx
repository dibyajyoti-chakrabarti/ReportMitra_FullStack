import { useOutletContext } from "react-router-dom";

function IssueDetails() {
  const [reportData] = useOutletContext();
  const issueID = reportData?.id || "DEFAULT_VAL";
  const firstName = reportData?.reporter_first_name || "DEFAULT_VAL";
  const midName = reportData?.reporter_middle_name || "DEFAULT_VAL";
  const lastName = reportData?.reporter_last_name || "DEFAULT_VAL";
  const issueTitle = reportData?.issue_title || "DEFAULT_VAL";
  const issueDesc = reportData?.issue_description || "DEFAULT_VAL";
  const issueLocation = reportData?.location || "DEFAULT_VAL";
  const issueDate = reportData?.issue_date
    ? new Date(reportData.issue_date).toLocaleDateString()
    : "DEFAULT_VAL";

  return (
    <div className="flex flex-col lg:flex-row border-2 border-dashed border-gray-400 mt-3 min-h-[70vh] lg:min-h-[75vh] rounded-xl shadow-sm">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 p-5 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-gray-400">
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Tracking ID: </span> {issueID}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Full Name: </span> {firstName} {midName}{" "}
          {lastName}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Title: </span> {issueTitle}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px] flex flex-col bg-gray-50 border border-gray-300 p-2 rounded-md overflow-y-auto max-h-40">
          <span className="font-bold">Issue Description: </span> {issueDesc}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Location: </span> {issueLocation}
        </div>
        <div className="text-base sm:text-lg lg:text-[18px]">
          <span className="font-bold">Issue Date: </span> {issueDate}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-5">
        <p className="font-bold text-lg lg:text-[18px] mb-2 text-center">
          Issue Image
        </p>
        <div className="relative bg-gray-900 w-full max-w-sm aspect-[4/3] rounded-lg shadow-md overflow-hidden flex items-center justify-center text-white">
          {reportData?.image_url ? (
            <img
              src={reportData.image_url}
              alt="Issue"
              className="w-full h-full object-contain"
            />
          ) : (
            "DEFAULT_VAL"
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueDetails;
