const assert = require('assert');

var BanToken = artifacts.require("BanToken");

contract("BanToken", (accounts) => {
    var tokenInstance;
    it("initializes the contract with the correct value", () => {
        return BanToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then((name) => {
            assert.equal(name, "Ban Token", "has the correct name");
            return tokenInstance.symbol();
        }).then((symbol) => {
            assert.equal(symbol, "BAN", "has the correct symbol");
        })
    });
    it("allocates the initial supply upon deployment", () => {
        return BanToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 1000000, "sets the total supply to 1,000,000");
            return tokenInstance.balanceOf(accounts[0]);
        }).then((adminBalance) => {
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to admin');
        });
    });

    it("transfer token ownership", () => {
        return BanToken.deployed().then((instance) => {
            tokenInstance = instance;
            // Try transfer large number of tokens than the balance
            return tokenInstance.transfer.call(accounts[1], 999999999999);
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return tokenInstance.transfer.call(accounts[1], 250000);
        }).then(success => {
            assert.equal(success, true, "it returns true");
            return tokenInstance.transfer(accounts[1], 250000);
        }).then((reciept) => {
            assert.equal(reciept.logs.length, 1, 'triggers one event');
            assert.equal(reciept.logs[0].event, 'Transfer', 'should be a "Transfer" event');
            assert.equal(reciept.logs[0].args._from, accounts[0], 'logs the account tokens are transfered from');
            assert.equal(reciept.logs[0].args._to, accounts[1], 'logs the account tokens are transfered to');
            assert.equal(reciept.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then((balance) => {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiver account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(balance => {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the senders account');
        });
    })
})