import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner, useAccount, useContract } from "wagmi";
import { useEffect, useState } from "react";
import { clampDAO, clampDAOABI } from '@/constants';
import { useRouter } from 'next/router';

const Navbar = () => {
    const {isConnected, address} = useAccount();
    const { data: signer } = useSigner();
    const [isMember, setIsMember] = useState<boolean>(false);
    const router = useRouter();

    const contract = useContract({
        address: clampDAO,
        abi: clampDAOABI,
        signerOrProvider: signer
    })

    
    // useEffect(() => {

    //     if(isConnected && address) {
    //         checkMember();
    //     }

    // }, [isConnected, address]);

    const checkMember = async () => {
        const member = await contract?.isMember(address);
        setIsMember(member);
    }

    const memberHandler = async () => {
        if(isMember) return;

        const tx = await contract?.becomeMember();
        await tx?.wait();

        setIsMember(true);
    }

    return (
        <nav className="flex justify-between w-11/12 m-auto">
            <div className="pt-2">
                <h1 className="text-3xl font-Lora cursor-pointer font-semibold" onClick={() => {router.push('/')}}>Clamp DAO</h1>
            </div>
            <div className="flex gap-10 pt-4 text-xl">
                <div>
                    <h2 className="cursor-pointer">Proposals</h2>
                </div>
                <div>
                    <h2 className="cursor-pointer">Profile</h2>
                </div>
                <div>
                    <h2 className='cursor-pointer'>Create</h2>
                </div>
            </div>
            <div>
                {isConnected && <button className="bg-white text-black h-12 font-semibold w-44 rounded-3xl" onClick={memberHandler}>{isMember ?
                "Member" :
                "Become member"}</button>}
                {
                    // isConnected ? <ConnectButton /> :  <button>Become member</button>
                }
            </div>
        </nav>
    )
};

export default Navbar;