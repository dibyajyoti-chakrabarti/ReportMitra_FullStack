function IssueDetails() {
  const issueID = "DEFAULT_VAL";
  const firstName = "DEFAULT_VAL";
  const midName = "DEFAULT_VAL";
  const lastName = "DEFAULT_VAL";
  const issueTitle = "DEFAULT_VAL";
  const issueDesc = "DEFAULT_VAL";
  const issueLocation = "DEFAULT_VAL";
  const issueDate = "DEFAULT_VAL";
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
          <span className="font-bold">Issue Description: </span> {issueDesc} Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi minima reprehenderit quia nemo consequuntur eaque eius! Esse, ex necessitatibus eveniet, perferendis temporibus aut, sint commodi earum ducimus tempora dolore quasi? Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, quae a, doloribus harum dolores et sunt est suscipit delectus culpa quis dolorem deleniti perspiciatis ullam doloremque exercitationem? Molestias, optio ipsum? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias voluptas facere minus! Corrupti aut, mollitia nostrum eveniet fuga tenetur, nisi numquam voluptate illum consectetur iste explicabo rerum itaque ab debitis.
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
          <div className=" inset-0 w-120 h-63 object-contain bg-black shadow-md text-white flex items-center justify-center">
            DEFAULT_VAL
          </div>
        </div>
      </div>
    </div>
  );
}
export default IssueDetails;
