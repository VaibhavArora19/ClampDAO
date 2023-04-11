//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ClampToken.sol";

contract ClampDAO is Ownable{

    event newProposalEvent(uint proposalId, address creator);
    event newVote(uint _proposalId, address voter, bool yesOrNo);
    event executionStarted(uint _proposalID, uint votesInFavour);
    event proposalCancelled(uint _proposalID, uint againstVotes);
    event proposalDropped(uint _proposalID, address creator);

    /**
     * @dev governanceToken is the instance of the ClampToken
     */
    IERC20 public immutable governanceToken;

    uint totalProposals;

    uint voterCount;

    /**
     * @notice mapping to check if the user is already a member of the DAO or not
     */
    mapping(address => bool) public isMember;

    ///array of all the DAO members
    address[] public members;

    /**
     * @dev Proposal is the structure of how a proposal will look like
     */
    struct Proposal {
        uint proposalID;
        address creator;
        string title;
        string description;
        uint timeToExecute;
        bool inExecution;
        bool isExecuted;
        bool isCanceled;
        uint inFavourVotes;
        uint inAgainstVotes;
        uint votingPeriod;
    }

    ///Array of all the proposals
    Proposal[] public proposals;

    /// @notice mapping of proposalID with the count of how many people marked a proposal as executed
    /// @notice atleast 10 votes needed to mark the proposal as executed 
    /// @notice so that rewards will be distributed to the creator
    mapping(uint => uint) public markAsExecuted;

    /// @notice mapping of proposalID with the count of how many people marked a proposal as not executed
    /// @notice atleast 10 votes needed to mark the proposal as not executed 
    /// @notice so that creator stake will be slashed
    mapping(uint => uint) public markAsNotExecuted;

    /// @notice mapping of user address with the number of times they claimed rewards
    mapping(address => uint) public claimedRewards;

    ///@notice mapping to check if user voted to mark proposal as executed/notExecuted
    mapping(uint => address[]) public isUserVotedForExecution; 
    ///Array of voters that are in favor of the proposal
    /**
     * @dev uint is the proposalID
     * @dev address[] is the array of addresses who are in favour of proposal
     */
    mapping(uint => address[]) public inFavour;

    ///Array of voters that are in against of proposal
    /**
     * @dev uint is the proposalID
     * @dev address[] is the array of addresses who are against of proposal
     */
    mapping(uint => address[]) public inAgainst;


    /**
     * @notice mapping of user address with proposal id the user voted for
     */
    mapping(address => uint[]) public votedProposals;
    
    /**
     * @param token is the address of the ClampToken
     */
    constructor(address token) {
        governanceToken = IERC20(token);
    }

    /**
     * @param _user is the address of user that you want to get the balance of
     * @return the balance of _user
     */
    function getBalance(address _user) public view returns(uint) {
        return governanceToken.balanceOf(_user);
    }

    /**
     * @dev becomeMember sends the makes the user the member of Clamp DAO
     */
    function becomeMember() external {
        require(!isMember[msg.sender], "You are already a member");
        require(governanceToken.balanceOf(msg.sender) > 1 * 10 ** 18, "Not enough balance");

        isMember[msg.sender] = true;
        voterCount++;
        members.push(msg.sender);

    }

    /**
     * 
     * @param _title is the title of the proposal
     * @param _description is the description of the proposal
     * @param _timeNeeded is the time needed to the user to execute the proposal\
     * @dev user needs to stake some ether in case he is unable to execute the proposal in the given time
     * @dev then his stake will be slashed
     */
    function createProposal(string calldata _title, string calldata _description, uint _timeNeeded) external payable{
        require(isMember[msg.sender], "You are not a member");
        require(governanceToken.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough CMP tokens");
        require(msg.value >= 0.01 ether, "Not enough amount sent");

        totalProposals++;

        Proposal memory newProposal = Proposal({proposalID: totalProposals, creator: msg.sender, title: _title, description: _description, timeToExecute: _timeNeeded, inExecution: false, isExecuted: false, isCanceled: false, inFavourVotes: 0, inAgainstVotes: 0, votingPeriod: block.timestamp + 5 days});

        proposals.push(newProposal);

        emit newProposalEvent(totalProposals, msg.sender);
    }

    /**
     * 
     * @param _proposalId is the proposalId you want to vote for
     * @param yesOrNo is the type of vote i.e whether you are in favour or in against
     */
    function vote(uint _proposalId, bool yesOrNo) external {
        require(isMember[msg.sender], "You are not a member");
        require(governanceToken.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough CMP tokens");
        require(_proposalId <= totalProposals, "Proposal does not exist!");
        require(!proposals[_proposalId - 1].isExecuted, "Proposal already executed");
        require(!proposals[_proposalId - 1].isCanceled, "Proposal Canceled");
        require(proposals[_proposalId - 1].creator != msg.sender, "You can't vote for your own proposal");
        require(proposals[_proposalId - 1].votingPeriod > block.timestamp, "Voting Period ended");
        require(!proposals[_proposalId - 1].inExecution, "Already in execution");
        
        for(uint i =0; i<votedProposals[msg.sender].length; i++) {
            if(votedProposals[msg.sender][i] == _proposalId){
                revert("You already voted for the proposal");
            }
        }

        Proposal storage proposal = proposals[_proposalId - 1];

        if(yesOrNo == true){
            proposal.inFavourVotes += 1;
            inFavour[_proposalId].push(msg.sender);
            
            if(proposal.inFavourVotes >= voterCount/2) {
                startExecution(_proposalId);
            }

        }else {
            proposal.inAgainstVotes += 1;
            inAgainst[_proposalId].push(msg.sender);

            if(proposal.inAgainstVotes >= voterCount/2) {
                cancelProposal(_proposalId);
            }
        }

        votedProposals[msg.sender].push(_proposalId);

        emit newVote(_proposalId, msg.sender, yesOrNo);
    }

    /**
     * @return all of the proposals ever created
     */
    function getAllProposals() external view returns(Proposal[] memory){
        return proposals;
    }

    /**
     *  @return all the proposals that you voted in
     */
    function getVotedProposals() external view returns(uint[] memory){
        return votedProposals[msg.sender];
    }

    /**
     * 
     * @return the addresses of all the voters that are in favor of a particular proposal
     */
    function getInFavor(uint _proposalID) external view returns(address[] memory) {
        return inFavour[_proposalID];
    }

    /**
     * 
     * @return the addresses of all the voters that are in against of a particular proposal
     */
    function getInAgainst(uint _proposalID) external view returns(address[] memory) {
        return inAgainst[_proposalID];
    }
 
    /**
     * @notice cancels the proposal if 50% votes are in against
     * @param _proposalID is the proposalID of the proposal
     */
    function cancelProposal(uint _proposalID) internal {

        if(proposals[_proposalID - 1].inAgainstVotes < voterCount/2) {
            revert("Not enough votes in against");
        }

        proposals[_proposalID - 1].isCanceled = true;

        emit proposalCancelled(_proposalID, proposals[_proposalID].inAgainstVotes);
    }

    /**
     * @notice marks the proposal as in execution so voting will not be allowed afterwards
     */
    function startExecution(uint _proposalID) internal {    
        Proposal memory proposal = proposals[_proposalID - 1];

        proposals[_proposalID - 1].inExecution = true;
        proposals[_proposalID - 1].timeToExecute = block.timestamp + proposals[_proposalID - 1].timeToExecute;

        emit executionStarted(_proposalID, proposal.inFavourVotes);
    }

    /**
     * @notice marks the function as executed by the voter
     */
    function markAsExecutedByVoter(uint _proposalID) external {
        require(isMember[msg.sender], "You are not a member");
        require(governanceToken.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough CMP tokens");
        require(_proposalID <= totalProposals, "Proposal doesn't exist");
        require(proposals[_proposalID - 1].inExecution, "Not in execution");
        require(!proposals[_proposalID - 1].isCanceled, "Proposal Cancelled");
        require(proposals[_proposalID - 1].timeToExecute < block.timestamp, "Execution time remaining");

        for(uint i =0; i<isUserVotedForExecution[_proposalID].length; i++) {
            if(isUserVotedForExecution[_proposalID][i] == msg.sender) {
                revert("Already voted");
            }
        }

        markAsExecuted[_proposalID] += 1;
        isUserVotedForExecution[_proposalID].push(msg.sender);

        if(markAsExecuted[_proposalID] >= 10) {
            markProposalAsExecuted(_proposalID);
        }

    }

    /**
     * @notice marks the function as not executed by the voter
     */
    function markAsNotExecutedByVoter(uint _proposalID) external {
        require(isMember[msg.sender], "Not a member");
        require(governanceToken.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough CMP tokens");
        require(_proposalID <= totalProposals, "Proposal doesn't exist");
        require(!proposals[_proposalID - 1].isExecuted, "Already executed");
        require(proposals[_proposalID - 1].inExecution, "Not in execution");
        require(!proposals[_proposalID - 1].isCanceled, "Proposal Cancelled");
        require(proposals[_proposalID - 1].timeToExecute < block.timestamp, "Execution time remaining");

        for(uint i =0; i<isUserVotedForExecution[_proposalID].length; i++) {
            if(isUserVotedForExecution[_proposalID][i] == msg.sender) {
                revert("Already voted");
            }
        }
        markAsNotExecuted[_proposalID] += 1;
        isUserVotedForExecution[_proposalID].push(msg.sender);

        if(markAsNotExecuted[_proposalID] >= 10) {
            markProposalAsCanceled(_proposalID);
        }
    }

    /**
     * @notice marks the function as executed officialy by the alogrithm based on votes
     * @notice returns the stake back to the creator plus reward them for participation
     * @param _proposalID is the ID of the proposal
     */
    function markProposalAsExecuted(uint _proposalID) internal {
 
        proposals[_proposalID - 1].isExecuted = true;
        
        address proposalCreator = proposals[_proposalID - 1].creator;

        (bool sent, ) = payable(proposalCreator).call{value: 0.01 ether}("");
        
        require(sent, "Transaction failed");

        governanceToken.transfer(proposalCreator, 1 * 10 ** 18);
    }

    function markProposalAsCanceled(uint _proposalID) internal {  

        proposals[_proposalID - 1].isCanceled = true;

    }

    /**
     * @notice share rewards with DAO member for active contribution in the DAO
     */
    function shareRewards() external {
        require(isMember[msg.sender], "You are not a member");
        require(governanceToken.balanceOf(msg.sender) >= 1 * 10 ** 18, "Not enough CMP tokens");

        uint voteCount = votedProposals[msg.sender].length;
        uint claimCount = claimedRewards[msg.sender];

        if(voteCount >= 5 && voteCount < 10 && claimCount < 1){

            claimedRewards[msg.sender] += 1; 
            governanceToken.transfer(msg.sender, 1 * 10 ** 18);    
        
        } else if (voteCount >= 10 && voteCount < 15 && claimCount < 2) {

            claimedRewards[msg.sender] += 1; 
            governanceToken.transfer(msg.sender, 2 * 10 ** 18);   

        } else if (voteCount >= 15 && voteCount < 20 && claimCount < 3) {
            
            claimedRewards[msg.sender] += 1; 
            governanceToken.transfer(msg.sender, 3 * 10 ** 18);   
        }
    }

    function dropProposal(uint _proposalID) external {
        require(_proposalID <= totalProposals, "Wrong proposal ID");
        require(msg.sender == proposals[_proposalID - 1].creator, "You are not the creator");
        require(!proposals[_proposalID - 1].isExecuted, "Already executed");
        require(!proposals[_proposalID - 1].isCanceled, "Already canceled");

        proposals[_proposalID - 1].isCanceled = true;

        emit proposalDropped(_proposalID, msg.sender);
    }

    function getProposalByProposalID(uint _proposalID) external view returns(Proposal memory){
        require(_proposalID <= totalProposals, "Proposal doesn't exist");

        return proposals[_proposalID - 1];
    }

    receive() external payable{}
    fallback() external payable{}
}