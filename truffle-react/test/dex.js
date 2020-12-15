const CHGToken = artifacts.require("./CHGToken.sol");
const DeX = artifacts.require("./DEX.sol")

contract('DeX', accounts => {
    it("successfully deployed CHG token contract", async () => {
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        console.log("CHG address: ", chg_address);
        assert.notEqual(chg_address, "", "CHG address is empty")
    })

    it("address that deploys CHG contract should be the initial total supply", async ()=>{
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        var total_supply = await CHGInstance.totalSupply.call();
        var dex_address_balance = await CHGInstance.balanceOf(deXInstance.address);
        assert.equal(dex_address_balance.toString(), total_supply.toString(), "init supply didn't go to the deployer")
    })

    it("should exchange CHG to ETH", async () => {
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        await deXInstance.buy({from: accounts[0], value:100});
        var balance = await CHGInstance.balanceOf(accounts[0]);
        assert.equal(balance, 100, "didn't buy CHG in exchange of ETH")
    })

    it("should sell CHG to get ETH", async () => {
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        await CHGInstance.approve(deXInstance.address, 100, {from: accounts[0]});
        await deXInstance.sell(100, {from: accounts[0]});
        var balance = await CHGInstance.balanceOf(accounts[0]);

        assert.equal(balance, 0, "cannot sell CHG to get ETH");
    })

    it("shouldn't be able to buy more than it has in ETH", async () => {
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        try{
            await deXInstance.buy({from: accounts[0], value:200*Math.pow(10, 18)});
            throw null;
        }catch(error){
            assert(error, "Expected an error but did not get one");
        }
    })

})
