// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.11;

contract Governed {
    address owner;
    mapping (address => bool) admins;

    constructor() {
        owner = msg.sender;
    }

    event adminModified(
        address indexed _newAdminAddress,
        address indexed _modifierAddress,
        bool            _adminStatus,
        uint256         _timestamp
    );

    function whoOwnsThis() public view returns (address) {
        return owner;
    }

    function isSignerAdmin() public view returns (bool) {
        return admins[msg.sender];
    }

    function addAdmin(address _admin) public isAdmin{
        require(msg.sender != _admin, "Self Reflection not permitted");
        admins[_admin] = true;
        emit adminModified( _admin, msg.sender, true, block.timestamp );
    }

    function removeAdmin(address _admin) public isAdmin{
        require(msg.sender != _admin, "Self Reflection not permitted");
        admins[_admin] = false;
        emit adminModified( _admin, msg.sender, false, block.timestamp );
    }

    modifier isOwner {
        require(
            msg.sender == owner,
            "This function is encumbered to OWNER"
        );
        _;
    }

    modifier isAdmin {
        require(
            admins[msg.sender] == true || msg.sender == owner,
            "This function is encumbered to OWNER and ADMIN(S)"
        );
        _;
    }
}