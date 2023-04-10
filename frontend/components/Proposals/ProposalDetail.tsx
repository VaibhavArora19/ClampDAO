import Image from "next/image";
import Reply from "../Replies/Reply";

const DUMMY_DETAILS = {
    creator: "0x1234567890",
    title: "Launch a new token",
    description: "This is a description of the proposal",
    votes: 7,
    replies: 27,
    timeNeeded: "5 days"
}

const REPLIES = [
    {
        creator: "0x1234567890",
        reply: "This is a reply to the proposal"
    },
    {
        creator: "0x1232167890",
        reply: "This is a reply to the proposal"
    },
    {
        creator: "0x123456723",
        reply: "This is a just a checking reply that is going to be big enough to check if everything is working fine"
    }

]

const ProposalDetail = () => {

    const replyHandler = () => {

    }

    const voteInFavourHandler = () => {}

    const voteAgainstHandler = () => {}
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-8">{DUMMY_DETAILS.title}</h1>
            <div className="flex gap-4">
                <Image className="rounded-full" src={"/avatar.avif"} height={36} width={36} alt="Profile image"/>
                <h2 className="relative top-2">By: {DUMMY_DETAILS.creator}</h2>
            </div>
            <div className="mt-10 ml-4">
                <h2 className="text-2xl mb-2 font-medium">Topic:</h2>
                <h3 className="text-lg mb-8 text-gray-300">{DUMMY_DETAILS.title}</h3>
                <h2 className="text-2xl mb-2 font-medium">Description:</h2>
                <h3 className="text-lg mb-8 text-gray-300">{DUMMY_DETAILS.description}</h3>
                <h2 className="text-2xl mb-2 font-medium">Time needed:</h2>
                <h3 className="text-lg mb-8 text-gray-300">{DUMMY_DETAILS.timeNeeded}</h3>
                <div className="flex gap-4">
                        <h2 className="text-lg mb-2 font-medium">Votes: {DUMMY_DETAILS.votes}</h2>
                        <h2 className="text-lg mb-2 font-medium">Replies: {DUMMY_DETAILS.replies}</h2>
                </div>
                <h2 className="text-lg mb-4 mt-4 font-medium">Current status: <span className="font-light">Active</span></h2>
            </div>
            <div className="ml-4 mt-4">
                <button className="bg-orange-500 rounded-full h-12 w-40 mr-4" onClick={replyHandler}>Reply</button>
                <button className="bg-green-500 rounded-full h-12 w-40 mr-4" onClick={voteInFavourHandler}>Vote in Favour</button>
                <button className="bg-red-500 rounded-full h-12 w-40" onClick={voteAgainstHandler}>Vote in Against</button>
            </div>
            <h1 className="mt-10 ml-4 font-semibold text-2xl">Replies</h1>
            <div>
                {
                    REPLIES.map(reply => {
                        return <Reply creator={reply.creator} reply={reply.reply}/>
                    })
                }
            </div>
        </div>
    )
};

export default ProposalDetail;
