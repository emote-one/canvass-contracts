// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import './governance/Governed.sol';

contract Canvass is Governed{
    
    constructor() {
        owner = msg.sender;
    }

}