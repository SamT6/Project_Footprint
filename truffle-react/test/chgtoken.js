const CHGToken = artifacts.require("./CHGToken.sol");
const DeX = artifacts.require("./DEX.sol")

contract('CHGToken', accounts => {
    it("total supply should be 100 ether", async () => {
        const instance = await CHGToken.new();
        var ts = await instance.totalSupply.call();
        //console.log(ts);
        //ts should be 100 ether (in hex: 0x56bc75e2d63100000), and in the form of wei
        assert.equal(ts, 100*Math.pow(10, 18), "total supply is wrong");
    })

    it("address that deploys CHG contract should be the initial total supply", async ()=>{
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        var total_supply = await CHGInstance.totalSupply.call();
        var dex_address_balance = await CHGInstance.balanceOf(deXInstance.address);
        assert.equal(dex_address_balance.toString(), total_supply.toString(), "init supply didn't go to the deployer")
    })

    it("successfully get the correct balance of a address", async ()=>{
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        await deXInstance.buy({from: accounts[2], value:100});
        const CHGInstance = await CHGToken.at(chg_address);
        var balance = await CHGInstance.balanceOf(accounts[2]);
        assert.equal(balance, 100, "cannot get the correct balance of a address")
    })

    it("transfering between two addresses works", async () => {
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        await deXInstance.buy({from: accounts[2], value:100});
        
        const CHGInstance = await CHGToken.at(chg_address);
        await CHGInstance.transfer(accounts[3], 100, {from: accounts[2]})

        var balance = await CHGInstance.balanceOf(accounts[3]);
        assert.equal(balance, 100, "cannot transfer between two addresses")

    })

    it("approving another address to spend on my behalf", async () => {
        // in previous test cases, accounts[2] has 100 CHG (in wei unit) left
        const deXInstance = await DeX.deployed();
        var chg_address = await deXInstance.token.call();
        const CHGInstance = await CHGToken.at(chg_address);
        
        await CHGInstance.approve(accounts[1], 100, {from: accounts[2]});
        await CHGInstance.transferFrom(accounts[2], accounts[4], 100, {from: accounts[1]});
        var balance = await CHGInstance.balanceOf(accounts[4]);
        assert.equal(balance, 100, "cannot transfer on someone's behalf after approval")
    })


})
