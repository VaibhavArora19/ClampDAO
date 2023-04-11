import { useContract, useSigner, useAccount } from "wagmi";
import { clampDAO, clampDAOABI } from "@/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

const Profile = () => {
    const [proposals, setProposals] = useState<Array<any>>([]);
    const [balance, setBalance] = useState<any>(null);
    const {address} = useAccount();
    const {data: signer} = useSigner();
    const router = useRouter();
    const contract = useContract({
        address: clampDAO,
        abi: clampDAOABI,
        signerOrProvider: signer
    });

    const getProposals = async () => {
        const getProposals = await contract?.getAllProposals();
        const getBalance = await contract?.getBalance(address);
        const yourProposals = getProposals.filter((proposal: any) => proposal.creator === address);
        
        setBalance(ethers.utils.formatEther(getBalance));
        setProposals(yourProposals);
    }

    useEffect(() => {

        if(contract) {
            getProposals();

        }
    }, [contract]);
    return (
        <div className="mt-28 ml-20">
        <div className="mb-8 text-3xl font-semibold underline">
            <h1>Your proposals</h1>
        </div>
        <div className="mb-12">
        {proposals.length > 0 &&
            proposals.map(proposal =>{
                return <h1 className="text-2xl w-8/12 text-blue-700 cursor-pointer hover:underline" onClick={() => {router.push(`/proposals/${proposal.proposalID}`)}}>{proposal.title}</h1>
            })
        }
        </div>
        <div>
            <h1 className="text-3xl font-semibold underline">Clamp Token Balance</h1>
            <h2 className="mt-4">{balance && balance + "CMP"}</h2>
        </div>
        
        </div>
    )
};

export default Profile;