//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClampToken is ERC20, Ownable {

    /**
     * @notice "CLAMP" is the governance token for ClampDAO
     */
    constructor() ERC20("CLAMP", "CMP") {
        _mint(msg.sender, 1000*10**18);
    }

    /**
     * @dev send the tokens to the ClampDAO contract
     */
    function transferTokens(address _receiver) external onlyOwner{
        transfer(_receiver, balanceOf(msg.sender));
    }

    /**
     * @dev allows the owner to mint more tokens if needed
     */
    function mintTokens(uint amount) external onlyOwner {
        _mint(msg.sender, amount*10**18);
    }

}