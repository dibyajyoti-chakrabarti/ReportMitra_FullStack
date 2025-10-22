function IssueAction() {
    const trackingID='DEFAULT_VAL';
    const status='DEFAULT_VAL'
    const dept='DEFAULT_VAL'
    const ackDate='DEFAULT_VAL'
    const resolutionDate='DEFAULT_VAL'
    const comments='DEFAULT_VAL'
    const escalated='DEFAULT_VAL'
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
          {comments} Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere alias laborum id labore ex quas provident. Officia dolorem facilis cupiditate aperiam, libero, mollitia, rerum expedita quisquam iure quo distinctio est! Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores error nihil blanditiis culpa, quasi expedita optio ut quia magnam pariatur necessitatibus quibusdam doloribus cum. Nam voluptatibus officiis iusto nisi voluptas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci magnam doloribus fuga! Iusto, qui nemo, quae cupiditate sapiente perspiciatis ducimus totam nobis ullam atque expedita voluptatem reprehenderit non officia eum.
        </div>
      </div>
    </div>
  );
}
export default IssueAction;
