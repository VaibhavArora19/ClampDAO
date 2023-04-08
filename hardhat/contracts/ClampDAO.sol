//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ClampToken.sol";

contract ClampDAO is Ownable{

    /**
     * @dev ClampTokenContract is the ERC20 governance Token of Clamp DAO
     * @dev governanceToken is the instance of the ClampToken
     */
    ClampToken public immutable ClampTokenContract;
    IERC20 public immutable governanceToken;

    /**
     * @dev constructor deployes the C
     */
    constructor() {
        ClampTokenContract = new ClampToken();
        governanceToken = IERC20(address(ClampTokenContract));
    }

    /**
     * @return the address of the ClampTokenContract
     */
    function getAddress() external view returns(address) {
        return address(ClampTokenContract);
    }

    /**
     * @param _user is the address of user that you want to get the balance of
     * @return the balance of _user
     */
    function getBalance(address _user) external view returns(uint) {
        return governanceToken.balanceOf(_user);
    }

    
}