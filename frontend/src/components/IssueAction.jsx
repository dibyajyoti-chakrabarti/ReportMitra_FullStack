import { useOutletContext } from "react-router-dom";

function IssueAction() {
  const [reportData] = useOutletContext();
    const trackingID = reportData?.id || "DEFAULT_VAL";
  const status = reportData?.status ? reportData.status.replace('_', ' ').toUpperCase() : "DEFAULT_VAL";
  const dept = "Public Works Department"; // Default department
  const ackDate = reportData?.issue_date ? new Date(reportData.issue_date).toLocaleDateString() : "DEFAULT_VAL";
  const resolutionDate = "Pending"; // Not in current API
  const comments = `Report is currently ${reportData?.status || 'pending'}. Our team will review and take appropriate action.`;
  const escalated = reportData?.status === 'in_progress' ? "Yes" : "No";

  return (
    <div className="flex border-dashed border-3 py-3 mt-3 h-70">
      <div className=" w-[50%] flex flex-col gap-1 justify-center pl-2 border-r-3 border-dashed">
        <div className="text-[18px]">
          <span className="font-bold">Tracking ID: </span> {trackingID}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Current Status: </span> {status}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Escalated?: </span> {escalated}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Department: </span> {dept}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Date of Acknowledgement: </span> {ackDate}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Date of Resolution: </span> {resolutionDate}
        </div>
      </div>
      <div className=" w-[50%] flex flex-col gap-1 px-2 overflow-y-scroll">
        <div className="text-[18px] flex flex-col">
          <p className="font-bold text-center">Comments from Department </p>
          {comments}
        </div>
      </div>
    </div>
  );
}
export default IssueAction;