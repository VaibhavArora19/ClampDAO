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

}