import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="mt-40 text-center">
      <div>
        <h2 className="text-5xl leading-20">
          On Chain governance with{" "}
          <span className="block mt-6 text-8xl font-semibold">CLAMP DAO</span>
        </h2>
      </div>
      <button className="mt-12 font-semibold bg-white text-black w-72 h-16 rounded-full text-xl" onClick={() => {router.push('/proposals')
    }}>
        See Proposals
      </button>
    </div>
  );
};

export default LandingPage;
