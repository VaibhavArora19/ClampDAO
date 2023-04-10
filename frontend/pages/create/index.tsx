import { useRef } from "react";


const Create = () => {
    const topicRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    return (
        <div className='mt-20 ml-[35rem]'>
            <form>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Topic</label>
                    <input type="text" className="w-6/12 h-12 rounded-lg pl-4" placeholder="Enter topic" ref={topicRef}/>
                </div>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Description</label>
                    <textarea className="rounded-lg pl-4 pt-4" rows={5} cols={57} placeholder="Enter description" ref={descriptionRef}/>
                </div>
                <div className="mb-6">
                    <label className="block text-xl mb-2">Time needed</label>
                    <input type="text" className="w-6/12 h-12 rounded-lg pl-4"placeholder="Time needed to execute proposal" ref={timeRef}/>
                </div>
                <button type="submit" className="rounded-lg bg-white text-black h-14 w-[28rem] ml-4 mt-4">Submit</button>
            </form>
        </div>
    )
};

export default Create;