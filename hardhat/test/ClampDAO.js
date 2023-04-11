const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contract", function() {

    let token, DAO, owner, addr1, addr2;
           
    beforeEach(async () => {

       [owner, addr1, addr2] = await ethers.getSigners();

       const tokenFactory = await ethers.getContractFactory('ClampToken');
       const daoFactory = await ethers.getContractFactory('ClampDAO');
       
       token = await tokenFactory.deploy();
       await token.deployed();

       DAO = await daoFactory.deploy(token.address);   
       await DAO.deployed();
   });
    
    describe("Proposal", () => {

        it("should make user a member", async () => {
            
            await DAO.becomeMember();
            
            const isMember = await DAO.isMember(owner.address);
            
            expect(isMember).to.equal(true);
        });

        it("Should allow user to create a proposal", async () => {

            await DAO.becomeMember();

            await DAO.createProposal('check', 'check description', 123, {value: ethers.utils.parseEther("0.01")});

            const proposals = await DAO.getAllProposals();

            expect(proposals.length).to.equal(1);
        });

        it('should allow other members to vote for your proposal', async () => {
            await DAO.becomeMember();

            await DAO.createProposal('check', 'check description', 123, {value: ethers.utils.parseEther("0.01")});

            const proposals = await DAO.getAllProposals();

            await token.transfer(addr1.address, ethers.utils.parseEther("10"));
            
            await DAO.connect(addr1).becomeMember();

            await DAO.connect(addr1).vote(proposals[0].proposalID, true);

            const favourVotes = await DAO.getInFavor(proposals[0].proposalID);

            expect(favourVotes.length).to.equal(1);
        });

        it('should start execution of the proposal', async () => {
            await DAO.becomeMember();

            await DAO.createProposal('check', 'check description', 123, {value: ethers.utils.parseEther("0.01")});

            const proposals = await DAO.getAllProposals();

            await token.transfer(addr1.address, ethers.utils.parseEther("10"));
            
            await DAO.connect(addr1).becomeMember();

            ///will make the total vote 1 and since totalVoters = 1 so 1/2 = 0 i.e. 1 >=0
            await DAO.connect(addr1).vote(proposals[0].proposalID, true);

            const proposal = await DAO.getProposalByProposalID(1);

            expect(proposal.inExecution).to.equal(true);
            expect(proposal.isCanceled).to.equal(false);
            expect(proposal.isExecuted).to.equal(false);
        });

        it('should be able to drop the proposal', async () => {
            await DAO.becomeMember();

            await DAO.createProposal('check', 'check description', 123, {value: ethers.utils.parseEther("0.01")});

            await DAO.dropProposal(1);

            const proposal = await DAO.getProposalByProposalID(1);

            expect(proposal.isCanceled).to.equal(true);
        })
    })
})