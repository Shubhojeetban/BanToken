// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract BanToken {
    string public constant name = "Ban Token";
    string public constant symbol = "BAN";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Transfer
    // Returns a bool
    // Exception if caller's account balance does not have enough tokens to spend.
    // Transfers of 0 values MUST be treated as normal transfers
    // Fires the Transfer event
    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}