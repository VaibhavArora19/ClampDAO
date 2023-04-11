import ProposalDetail from "@/components/Proposals/ProposalDetail";
import { useRouter } from "next/router";

const ProposalDetails = () => {
    const router = useRouter();
    const { proposalId } = router.query;

    return (
        <div className="mt-24 ml-48 mb-20">
            <ProposalDetail proposalId={proposalId}/>
        </div>
    )
};

export default ProposalDetails;
