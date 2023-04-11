import { FormEvent, useRef } from "react";
import { useContract, useSigner } from "wagmi";
import { clampDAO, clampDAOABI } from "@/constants";
import { ethers } from "ethers";


const Create = () => {
    const topicRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const {data: signer} = useSigner();
    const contract = useContract({
        address: clampDAO,
        abi: clampDAOABI,
        signerOrProvider: signer
    })

    const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await contract?.createProposal(topicRef.current?.value, descriptionRef.current?.value, timeRef.current?.value, {value: ethers.utils.parseEther("0.01")})
    }

    return (
        <div className='mt-20 ml-[35rem]'>
            <form onSubmit={formSubmitHandler}>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Topic</label>
                    <input type="text" className="w-6/12 h-12 rounded-lg pl-4" placeholder="Enter topic" ref={topicRef} required/>
                </div>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Description</label>
                    <textarea className="rounded-lg pl-4 pt-4" rows={5} cols={57} placeholder="Enter description" ref={descriptionRef} required/>
                </div>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Time needed</label>
                    <input type="text" className="w-6/12 h-12 rounded-lg pl-4"placeholder="Time needed to execute proposal" ref={timeRef} required/>
                </div>
                <button type="submit" className="rounded-lg bg-white text-black h-14 w-[28rem] ml-4 mt-4">Submit</button>
            </form>
        </div>
    )
};

export default Create;