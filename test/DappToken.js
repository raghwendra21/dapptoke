var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts){
    // console.log(accounts)
    var tokenInstance;

    it("initializes the contract with correct values", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name()

        }).then(function(name){
          assert.equal(name, 'Dapp Token', 'has the correct name')
          return tokenInstance.symbol();
        }).then(function(symbol){
           assert.equal(symbol, 'DAPP', 'has the correct symbol')
           return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'Dapp Token v1.0', 'has the correct standard')
        })
    })

    it("sets the total supply upon deployment", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
           
            assert.equal(totalSupply.toNumber(), 10000000, 'sets the total supply 10000000')
            return tokenInstance.balanceOf(accounts[0])
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',balanceOf(accounts[0]))
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),10000000, 'it allocates the initialsupply to the adminaccounts')
        })
    })

    it ("transfer token ownership", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, 'error message must contain revert')
            return tokenInstance.transfer.call(accounts[1], 25000, {from : accounts[0]})
        }).then(function(success){
            assert.equal(success, true, 'it returns true')
            return tokenInstance.transfer(accounts[1], 25000, {from : accounts[0]})
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer','should be a "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0],'logs the account token transfer from');
            assert.equal(receipt.logs[0].args._to, accounts[1],'logs the account token transfer to');
            assert.equal(receipt.logs[0].args._value, 25000,'logs the transfer amount')
            return tokenInstance.balanceOf(accounts[1])
        }).then(function(balance){
            assert.equal(balance.toNumber(),25000, 'adds the amount in receving account')
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),9975000, 'dedusts the ammount from sending amount')

        })
    })

it ('approve token for delegated transfer', function(){
   return DappToken.deployed().then(function(instance){
       tokenInstance = instance;
       return tokenInstance.approve.call(accounts[1], 100)
   }).then(function(success){
       assert.equal(success, true, 'it returns true')
       return tokenInstance.approve(accounts[1], 100)
   }).then(function(receipt){
    assert.equal(receipt.logs.length,1,'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval','should be a "Approval" event');
    assert.equal(receipt.logs[0].args._owner, accounts[0],'logs the account token transfer from');
    assert.equal(receipt.logs[0].args._spender, accounts[1],'logs the account token transfer to');
    assert.equal(receipt.logs[0].args._value, 100,'logs the transfer amount')
    return tokenInstance.allowance(accounts[0], accounts[1])
   }).then(function(allowance){
       assert.equal(allowance.toNumber(), 100 , 'strore the allowance for deleagate transfer')
   }) 
})

it("handles delegated transfer", function(){
    return DappToken.deployed().then(function(instance){
        tokenInstance = instance;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4]
        //transfer some tokens to FromAcoount
        return tokenInstance.transfer(fromAccount, 100 , {from: accounts[0]})
    }).then(function(receipt){
        //Approve spendingAccount to spend 10 token fromAccount
         return tokenInstance.approve(spendingAccount, 10 , {from : fromAccount})


    }).then(function(receipt){
        //try transfering something larger trhan the sender balancer
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount})
    }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert')>=0, 'cannot transfer value larger than balnce')
        //try transfering something larger than approve amount
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount})
    }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert')>=0, 'cannot transfer value larger than approved amount')
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount})
    }).then(function(success){
        assert.equal(success, true)
        return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount})
    }).then(function(receipt){
        assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer','should be a "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount,'logs the account token transfer from');
            assert.equal(receipt.logs[0].args._to, toAccount,'logs the account token transfer to');
            assert.equal(receipt.logs[0].args._value, 10,'logs the transfer amount')
            return tokenInstance.balanceOf(fromAccount)
    }).then(function(balance){
          assert.equal(balance.toNumber(), 90, 'deducts the sending amount')
          return tokenInstance.balanceOf(toAccount)
    }).then(function(balance){
        assert.equal(balance.toNumber(), 10, 'adds the sending amount')
        return tokenInstance.allowance(fromAccount, spendingAccount)
    }).then(function(allowance){
       assert.equal(allowance.toNumber(), 0 , 'deducts the ammont from the allowance')
    })
})



})
