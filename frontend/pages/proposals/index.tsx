import SingleProposal from "@/components/Proposals/SingleProposal";

const DUMMY_PROPOSALS = [
  {
    id: "p1",
    title: "Deploy Clamp on zkEVM",
    votes: 17,
    replies: 10,
    timeRemaining: "5 days",
  },
  {
    id: "p2",
    title: "Launch a new token",
    votes: 7,
    replies: 27,
    timeRemaining: "5 days",
  },
  {
    id: "p3",
    title: "Launch a new version of the protocol called as Clamp",
    votes: 45,
    replies: 20,
    timeRemaining: "5 days",
  },
];

const Proposals = () => {
  return (
    <div className="mt-24">
      {/* <div className="w-9/12 text-2xl h-40 m-auto">
                <h3>
                    Hello and welcome to CLAMP DAO governance. Here you can vote on proposals, create new proposals, and discuss proposals with other members of the community.
                </h3>
            </div> */}
      <div className="flex gap-4 text-lg ml-48 w-6/12">
        <div className="cursor-pointer">
          <h1>Active Proposals</h1>
        </div>
        <div className="cursor-pointer">
          <h1>All proposals</h1>
        </div>
        <div className="cursor-pointer">
          <h1>Your proposals</h1>
        </div>
      </div>
      <div className="flex gap-4 rounded-lg ml-48 mt-10 text-lg pl-8 pt-2 bg-gray-800 h-10 w-10/12">
        <h3 className="w-8/12">Topic</h3>
        <h3 className="w-20">Votes</h3>
        <h3 className="w-24">Replies</h3>
        <h3>Time Remaining</h3>
      </div>
      <div className="ml-48 mt-8">
        {DUMMY_PROPOSALS.map((proposal) => {
          return (
            <SingleProposal
              key={proposal.id}
              id={proposal.id}
              title={proposal.title}
              votes={proposal.votes}
              replies={proposal.replies}
              timeRemaining={proposal.timeRemaining}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Proposals;
