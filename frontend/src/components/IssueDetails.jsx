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
  const issueDate = reportData?.issue_date ? new Date(reportData.issue_date).toLocaleDateString() : "DEFAULT_VAL";

  return (
    <div className="flex border-dashed border-3 py-3 mt-3 h-80">
      <div className=" w-[50%] flex flex-col gap-1 justify-center pl-2 border-r-3 border-dashed">
        <div className="text-[18px]">
          <span className="font-bold">Tracking ID: </span> {issueID}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Full Name: </span> {firstName} {midName}{" "}
          {lastName}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Issue Title: </span> {issueTitle}
        </div>
        <div className="text-[18px] overflow-y-scroll flex flex-col mr-2 border-2 px-2">
          <span className="font-bold">Issue Description: </span> {issueDesc}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Issue Location: </span> {issueLocation}
        </div>
        <div className="text-[18px]">
          <span className="font-bold">Issue Date: </span> {issueDate}
        </div>
      </div>
      <div className=" w-[50%] flex flex-col gap-1 ">
        <div className="text-[18px] flex flex-col items-center">
          <p className="font-bold">Issue Image </p>
          <div className="inset-0 w-120 h-63 object-contain bg-black shadow-md text-white flex items-center justify-center">
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
    </div>
  );
}
export default IssueDetails;