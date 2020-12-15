pragma solidity ^0.6.0;

import "./CHGToken.sol";

/*
version 0.1 
author: Samuel Tang
*/
/// @title Footprint
/// @author Samuel Tang
///@notice Footprint, a decentralized funding platform for social projects
contract Footprint{
    
    uint256 public number_of_projects; // total number of projects
    
    struct Project{
        uint256 uid; // unique id 
        address owner;  // founder address 
        string topic;   // type of project
        string name;    // name of project
        uint256 valuation; // amount of token raised
        // string description; // description of project, off-chain (local database, IPFS, ...)
        // future work: team members
    }
    
    // uid => project
    mapping(uint256 => Project) public projects;
    
    
    IERC20 public changeToken; 
    
    event LogProjectProposed(address owner, string name, string topic);
    event LogProjectFunded(address funder, address owner, string name, uint256 amount);
    
    constructor(address chgAddress) public{
        number_of_projects = 0;
        changeToken = CHGToken(chgAddress); 
    }
    
    /// @param topic topic of proposing project
    /// @param name name of proposing project
    /// @return newly created projectID
    function proposeProject(string memory topic, string memory name) public returns(uint256){
        uint256 projectID = number_of_projects++;
        projects[projectID] = Project(projectID, msg.sender, topic, name, 0);
    
        emit LogProjectProposed(msg.sender, name, topic);
        return projectID;
    }
    
    /// @param uid unique id of project
    /// @param amount amount of CHG token fund project
    function fundProject(uint256 uid, uint256 amount) public{
        // user will need to first grant access to this smart contract to transfer their token
        changeToken.transferFrom(msg.sender, projects[uid].owner, amount);
        projects[uid].valuation += amount;

        emit LogProjectFunded(msg.sender, projects[uid].owner, projects[uid].name, amount);
    }
    
    /// @param uid unique id of project
    /// @return project information
    function getProject(uint256 uid) public view returns(address, string memory, string memory, uint256){
        return (projects[uid].owner, projects[uid].topic, projects[uid].name, projects[uid].valuation);
    }
    
}