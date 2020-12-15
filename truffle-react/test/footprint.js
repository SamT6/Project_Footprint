const Footprint = artifacts.require("./FootPrint.sol");
const CHGToken = artifacts.require("./CHGToken.sol")
const DeX = artifacts.require("./DEX.sol")

contract("Footprint", accounts => {
    it("number of project should be 1", async () => {
        const instance = await Footprint.deployed();
        await instance.proposeProject("Education", "CloudLearn", { from: accounts[0] });
        var numOfProject = await instance.number_of_projects.call();
        assert.equal(numOfProject, 1, "number of project did not increase")
    });

    it("example project[0] name should be 'CloudLearn'", async () => {
        const instance = await Footprint.deployed();
        var project0 = await instance.getProject("0");
        assert.equal(project0[2], "CloudLearn", "name of project[0] is not correct")
    })

    it("CHG token address shouldn't be empty", async () => {
        const instance = await Footprint.deployed();
        var address = await instance.changeToken.call();
        console.log("CHG address: ", address);
        assert.notEqual(address, "", "CHG address is empty")
    })

    it("Footprint contract should have the same CHG address as DeX contract", async () => {
        const footprintInstance = await Footprint.deployed();
        var chg_address1 = await footprintInstance.changeToken.call();

        const deXInstance = await DeX.deployed();
        var chg_address2 = await deXInstance.token.call();

        assert.equal(chg_address1, chg_address2, "they don't have the same CHG token address")
    })

    it("funding should go directly to project owner", async () => {
        const footprintInstance = await Footprint.deployed();
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        // get CHG token
        await deXInstance.buy({from: accounts[1], value:100});
        //allow Footprint contract to spend 
        const CHGInstance = await CHGToken.at(chg_address);
        await CHGInstance.approve(footprintInstance.address, 100, {from: accounts[1]});
        //then fund the project, fund the temp project in testing #1
        await footprintInstance.fundProject(0, 100, {from: accounts[1]});

        var account0CHGBalance = await CHGInstance.balanceOf(accounts[0]);
        assert.equal(account0CHGBalance, 100, "fund didn't transfer properly")
    })
    
    
});