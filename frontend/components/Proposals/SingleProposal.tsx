type Proposal = {
    id: string;
    title: string;
    votes: number;
    replies: number;
    timeRemaining: string;
}

const SingleProposal = (props: Proposal) => {
    return (
        <div className="mb-6 flex">
            <h1 className="text-xl w-8/12 text-blue-700 cursor-pointer hover:underline">{props.title}</h1>
            <h2 className="w-24">{props.votes}</h2>
            <h2 className="w-28 text-orange-400">{props.replies}</h2>
            <h2>{props.timeRemaining}</h2>
        </div>
    )
};

export default SingleProposal;