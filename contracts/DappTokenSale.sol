pragma solidity ^0.4.2;

import "./DappToken.sol";

contract DappTokenSale {

    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 amount);
    
    function DappTokenSale(DappToken _tokenContract,uint256 _tokenPrice)public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        


    }

    //multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    //Buy Tokens
    function buyTokens(uint256 _numberOfTokens) public payable{
        //Require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens,tokenPrice));
        //Require that the contract has enough tokens
        //Reqire that a transfer is successfull
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of token sold
        tokenSold += _numberOfTokens;
        //Triggerr sell event
        emit Sell(msg.sender, _numberOfTokens);

        
    }

    //End of token sale
    function endSale() public{
        //Require Admin
        require(msg.sender == admin);
        //transfer remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        //Destroy this contract
        selfdestruct(admin);

    }







}