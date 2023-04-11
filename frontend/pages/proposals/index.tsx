import SingleProposal from "@/components/Proposals/SingleProposal";
import { useEffect, useState } from "react";
import { useSigner, useAccount, useContract } from "wagmi";
import { clampDAO, clampDAOABI } from "@/constants";

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
  const { address } = useAccount();
  const {data: signer} = useSigner();
  const [proposals, setProposals] = useState<Array<any>>([]);
  const [proposalType, setProposalType] = useState<string>('active');

  const contract = useContract({
    address: clampDAO,
    abi: clampDAOABI,
    signerOrProvider: signer,
  })

  const getProposals = async () => {
    const allProposals = await contract?.getAllProposals();
    console.log('proposals', allProposals)
    
    if(proposalType === 'active') {
      const activeProposals = allProposals.filter((proposal: any) => {
        return !proposal.isExecuted && !proposal.isCancelled;
      })

      setProposals(activeProposals)
    }else if(proposalType === 'executed') {
      const executedProposals = allProposals.filter((proposal: any) => {
        return proposal.isExecuted;
      })

      setProposals(executedProposals)
    }else if(proposalType === 'all') {
      setProposals(allProposals);
    }
  }

  useEffect(() => {
    
    if(address && contract) {
      getProposals();
    }
  
  }, [address, contract, proposalType]);

  return (
    <div className="mt-24">
      {/* <div className="w-9/12 text-2xl h-40 m-auto">
                <h3>
                    Hello and welcome to CLAMP DAO governance. Here you can vote on proposals, create new proposals, and discuss proposals with other members of the community.
                </h3>
            </div> */}
      <div className="flex gap-4 text-lg ml-48 w-6/12">
        <div className={`cursor-pointer ${proposalType === 'active' ? 'text-white' : 'text-gray-400'}`} onClick={() => {setProposalType('active')}}>
          <h1>Active Proposals</h1>
        </div>
        <div className={`cursor-pointer ${proposalType === 'executed' ? 'text-white' : 'text-gray-400'}`} onClick={() => {setProposalType('executed')}}>
          <h1>Executed proposals</h1>
        </div>
        <div className={`cursor-pointer ${proposalType === 'all' ? 'text-white' : 'text-gray-400'}`} onClick={() => {setProposalType('all')}}>
          <h1>All proposals</h1>
        </div>
      </div>
      <div className="flex gap-4 rounded-lg ml-48 mt-10 text-lg pl-8 pt-2 bg-gray-800 h-10 w-10/12">
        <h3 className="w-8/12">Topic</h3>
        <h3 className="w-20">Votes</h3>
        <h3 className="w-24">Replies</h3>
        <h3>Time Needed</h3>
      </div>
      <div className="ml-48 mt-8">
        {proposals.length > 0 && proposals.map((proposal) => {
          return (
            <SingleProposal
              key={proposal.proposalID}
              id={proposal.proposalID}
              title={proposal.title}
              votes={Number(proposal.inFavourVotes) + Number(proposal.inAgainstVotes)}
              replies={7}
              timeRemaining={proposal.timeToExecute.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Proposals;
