var DappToken = artifacts.require("./DappToken.sol");
var DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(DappToken, 10000000).then(function(){
    //token price is 0.001ether
    var tokenPrice = 1000000000000000;
     return deployer.deploy(DappTokenSale,DappToken.address,tokenPrice);
  
    }) 
};

