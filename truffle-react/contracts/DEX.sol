pragma solidity ^0.6.0;

import "./CHGToken.sol";

/// @title DEX
/// @author Samuel Tang
///@notice Contract of Decentralized Exchange between ETH and CHG
contract DEX {

    IERC20 public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    address public owner;
    //Circuit Breaker design 
    bool public stopped;
    modifier stopInEmergency { require(!stopped); _; }
    modifier onlyInEmergency { require(stopped); _; }

    constructor() public {
        token = new CHGToken();
        owner = msg.sender;
        stopped = false;
    }

    //Circuit Breaker design 
    function declareEmergency() public{
        require(msg.sender == owner, "need admin access");
        stopped = true;
    }
    //Circuit Breaker design 
    function clearEmergency() public{
        require(msg.sender == owner, "need admin access");
        stopped = false;
    }

    /// @notice send in ETH and get CHG
    function buy() payable public stopInEmergency{
        uint256 amountTobuy = msg.value;
        uint256 dexBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    /// @notice will need to grant access to this contract's address to spend on msg.sender's behalf
    // on Change Token smart contract (approve method)
    /// @param amount amount of CHG to exchange to ETH
    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), amount);
        msg.sender.transfer(amount);
        emit Sold(amount);
    }
}
