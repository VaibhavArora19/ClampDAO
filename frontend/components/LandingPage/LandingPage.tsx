import { useRouter } from "next/router";
import { useSigner, useAccount, useContract } from "wagmi";
import { useEffect, useState } from "react";
import { clampDAO, clampDAOABI } from '@/constants';
import { ethers } from "ethers";
import { sign } from "crypto";

const LandingPage = () => {
  const router = useRouter();
  const {isConnected, address} = useAccount();
  const { data: signer } = useSigner();
  const [isMember, setIsMember] = useState<boolean>(false);
  
  const contract = useContract({
    address: clampDAO,
    abi: clampDAOABI,
    signerOrProvider: signer
})


const checkMember = async () => {
  const member = await contract?.isMember(address);
  setIsMember(member);
}


useEffect(() => {

      if(contract && signer) {
        checkMember();
      }

}, [contract, signer]);

const memberHandler = async () => {
    if(isMember) return;

    const tx = await contract?.becomeMember();
    await tx?.wait();

    setIsMember(true);
}

  return (
    <div className="mt-40 text-center">
      <div>
        <h2 className="text-5xl leading-20">
          On Chain governance with{" "}
          <span className="block mt-6 text-8xl font-semibold">CLAMP DAO</span>
        </h2>
      </div>
      <button className="mt-12 font-semibold bg-white text-black w-72 h-16 rounded-full text-xl" onClick={memberHandler}>
        {!isMember ? "Become member" : "Member"}
      </button>
    </div>
  );
};

export default LandingPage;
