import Image from "next/image";

type IProps = {
    creator: string;    
    reply: string;
}
const Reply = (props: IProps) => {
    return (
        <div className="mt-10">
            <div className="flex gap-4">
                <Image className="rounded-full" src="/voter.avif" height={36} width={36} alt="Voter image"/>
                <h2>{props.creator}</h2> 
            </div>
            <h1 className="ml-12 text-gray-300">{props.reply}</h1>
        </div>
    )
};

export default Reply;