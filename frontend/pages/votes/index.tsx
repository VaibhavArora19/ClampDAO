import { useState, useEffect } from "react";
import { useContract, useSigner, useAccount } from "wagmi";
import { clampDAO, clampDAOABI } from "@/constants";
import { useRouter } from "next/router";
import Image from "next/image";

const Votes = () => {
    const router = useRouter();
    const [users, setUsers] = useState<Array<any>>([]);
    const [userType, setUserType] = useState<string>("favour");
    const {data: signer} = useSigner();
    const {address} = useAccount();
    const contract = useContract({
        address: clampDAO,
        abi: clampDAOABI,
        signerOrProvider: signer
    })

    const {proposalID} = router.query;

    const getVotes = async () => {
        if(userType === 'favour') {
            const votes = await contract?.getInFavor(proposalID);
            console.log('votes are', votes);
            setUsers(votes);

        }else if(userType === 'against') {

            const votes = await contract?.getInAgainst(proposalID);
            setUsers(votes)
        }

    }

    useEffect(() => {
        
        if(contract) {
            getVotes();
        }

    }, [contract, userType]);

    return (
        <div>
            <div className="flex gap-4 mt-16 ml-40 text-2xl font-semibold">
                <h1 className={`${userType === 'favour' ? "text-white" : "text-gray-400"} cursor-pointer`} onClick={() => {setUserType("favour")}}>In Favour</h1>
                <h1 className={`${userType === 'against' ? "text-white" : "text-gray-400"} cursor-pointer`} onClick={() => {setUserType("against")}}>In Against</h1>
            </div>
            <div className="mt-10 ml-36">
                {
                    users.map(user => {
                        return (
                            <div className="flex gap-4" key={user}>
                                <Image src="/voter.avif" width={42} height={42} alt="Profile image"/>
                                <h1 className="text-xl font-semibold relative top-4">{user}</h1>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Votes;