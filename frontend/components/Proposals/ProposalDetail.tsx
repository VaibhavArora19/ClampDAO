import Image from "next/image";
import Reply from "../Replies/Reply";
import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { clampDAO, clampDAOABI } from "@/constants";
import { useRouter } from "next/router";

const ProposalDetail = (props: {proposalId: string | string[] | undefined}) => {
    const router = useRouter();
    const [proposalDetails, setProposalDetails] = useState<any>(null);
    const [status, setStatus] = useState<string>('');
    const [replies, setReplies] = useState<Array<any>>([]);
    const [replyActive, setReplyActive] = useState<boolean>(false);
    const [userReply, setUserReply] = useState<string>("");
    const {address} = useAccount();
    const {data: signer} = useSigner();
    const contract = useContract({
        address: clampDAO,
        abi: clampDAOABI,
        signerOrProvider: signer
    })

    const getProposalDetails = async () => {
        const details = await contract?.getProposalByProposalID(props.proposalId);
        const data = await fetch(`/api/${props.proposalId}`);
        const response = await data.json();

        if(!details.isExecuted && !details.isCancelled && !details.inExecution) {
            setStatus('active');
        } else if(!details.isExecuted && !details.isCancelled && details.inExecution) {
            setStatus('in execution');
        }else if(details.isExecuted && !details.isCancelled && !details.inExecution) {
            setStatus('executed');
        }else if(details.isCancelled && !details.isExecuted && !details.inExecution) {
            setStatus('cancelled');
        }
        console.log(response)
        if(response !== null) {
            setReplies(response?.replies)
        }
        setProposalDetails(details);
    }


    useEffect(() => {
        if(props.proposalId) getProposalDetails();
    }, [props.proposalId]);

    const replyHandler = () => {
        setReplyActive(!replyActive);

    }

    const voteInFavourHandler = async () => {
        await contract?.vote(props.proposalId, true);
    }

    const voteAgainstHandler = async () => {
        await contract?.vote(props.proposalId, false);
    }

    const replyValueHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        setUserReply(event.target.value)

    }

    const sendReplyHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

      const data = await fetch(`/api/${props.proposalId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                proposalId: props.proposalId,
                reply: userReply,
                address: address
            })
        });

        const response = await data.json();
        console.log('response is', response);

        if(response !== null) {
            setReplies(response.replies);
        }

    }   

    return (
        <>
        {proposalDetails &&
        <div>
            <h1 className="text-3xl font-semibold mb-8">{proposalDetails.title}</h1>
            <div className="flex gap-4">
                <Image className="rounded-full" src={"/avatar.avif"} height={36} width={36} alt="Profile image"/>
                <h2 className="relative top-2">By: {proposalDetails.creator}</h2>
            </div>
            <div className="mt-10 ml-4">
                <h2 className="text-2xl mb-2 font-medium">Topic:</h2>
                <h3 className="text-lg mb-8 text-gray-300">{proposalDetails.title}</h3>
                <h2 className="text-2xl mb-2 font-medium">Description:</h2>
                <h3 className="text-lg mb-8 text-gray-300 w-9/12">{proposalDetails.description}</h3>
                <h2 className="text-2xl mb-2 font-medium">Time needed:</h2>
                <h3 className="text-lg mb-8 text-gray-300">{Math.floor(Number(proposalDetails.timeToExecute.toString()) / 86400)} Days</h3>
                <div className="flex gap-4">
                        <h2 className="text-lg mb-2 font-medium">Votes in favour: {proposalDetails.inFavourVotes.toString()}</h2>
                        <h2 className="text-lg mb-2 font-medium">Votes in against: {proposalDetails.inAgainstVotes.toString()}</h2>
                        <h2 className="text-lg mb-2 font-medium">Replies: {replies.length > 0 ? replies.length: 0}</h2>
                </div>
                <h2 className="text-lg mb-4 mt-4 font-medium">Current status: <span className="font-light">{status && status}</span></h2>
            </div>
            <div className="ml-4 mt-4 flex">
                <button className="bg-orange-500 rounded-full h-12 w-40 mr-4" onClick={replyHandler}>Reply</button>
                { status === 'active' &&
                <div>
                    <button className="bg-green-500 rounded-full h-12 w-40 mr-4" onClick={voteInFavourHandler}>Vote in Favour</button>
                    <button className="bg-red-500 rounded-full h-12 w-40" onClick={voteAgainstHandler}>Vote in Against</button>
                </div>
                }
                <button className="bg-blue-500 ml-4 rounded-full h-12 w-40 mr-4" onClick={() => {router.push(`/votes?proposalID=${props.proposalId}`)}}>See Votes</button>
            </div>
            { replyActive &&
            <div className="mt-10 ml-4">
                <input className="h-12 pl-4 rounded-lg w-80" value={userReply} onChange={replyValueHandler} placeholder="Add your reply"/>
                <button className="bg-blue-600 ml-6 rounded-full h-10 w-40" onClick={sendReplyHandler}>Send</button>
            </div>
            }
            <h1 className="mt-10 ml-4 font-semibold text-2xl">Replies</h1>
            <div>
                {replies.length > 0 &&
                    replies.map(reply => {
                        return <Reply creator={reply.address} reply={reply.reply}/>
                    })
                }
            </div>
        </div>
}
    </>
    )
};

export default ProposalDetail;
