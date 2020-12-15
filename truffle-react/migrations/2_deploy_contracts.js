
const DeX = artifacts.require("./DEX.sol");
const Footprint = artifacts.require("./FootPrint.sol");


module.exports = function(deployer) {
  deployer.deploy(DeX).then(async ()=>{
    const DeXInstance = await DeX.deployed();
    const CHGAddress = await DeXInstance.token();
    console.log("Change Token Address", CHGAddress);
    return deployer.deploy(Footprint, CHGAddress);
  })

};
