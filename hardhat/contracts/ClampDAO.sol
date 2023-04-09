//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ClampToken.sol";

contract ClampDAO is Ownable{

    /**
     * @dev governanceToken is the instance of the ClampToken
     */
    IERC20 public immutable governanceToken;

    int totalProposals;

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
        int proposalID;
        address creator;
        string title;
        string description;
        uint timeNeeded;
        bool isExecuted;
        uint inFavourVotes;
        uint inAgainstVotes;
    }

    ///Array of all the proposals
    Proposal[] public proposals;

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
     * @dev constructor deployes the C
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
     * @dev becomeMember sends the user ClampToken to the member to make sure that they are a member of the ClampDAO
     */
    function becomeMember() external {
        require(!isMember[msg.sender], "You are already a member");
        require(getBalance(address(this)) > 1*10**18, "Not sufficient balance");

        isMember[msg.sender] = true;
        governanceToken.transfer(msg.sender, 1*10**18);

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
        require(isMember[msg.sender], "You are not the member");
        require(msg.value >= 0.01 ether, "Not enough amount sent");

        totalProposals++;

        proposals.push(Proposal({proposalID: totalProposals, creator: msg.sender, title: _title, description: _description, timeNeeded: _timeNeeded, isExecuted: false, inFavourVotes: 0, inAgainstVotes: 0}));
    }


    receive() external payable{}
    fallback() external payable{}
}