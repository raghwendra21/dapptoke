pragma solidity ^0.4.2;

contract DappToken {
    //Constructor
    //Set the total number of tokens
    //Name
    string public name ="Dapp Token";
    string public symbol ="DAPP";
    string public standard ="Dapp Token v1.0";
    //Symbol
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    //transfer
    // approve
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value

    );

    mapping(address => uint256)public balanceOf;
    mapping(address=> mapping(address => uint256)) public allowance;
    //allowance

    //Read the total number of tokens
    function DappToken(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        //allocate the initial supply
    }
    //Transfer
    //Exception if account doesn't have enough balance
    //Return bool
    //Transfer event
    function transfer(address _to, uint256 _value) public returns(bool success){
          //Exception if account doesn't have enough balance
        require(balanceOf[msg.sender] >= _value);
          //Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;  
         //Return bool
        //Transfer event

        Transfer(msg.sender, _to, _value);
        return true;

        

    }

    //approve

    function approve(address _spender, uint256 _value) public returns(bool success){

        // allowance
        allowance[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);
        //approve event
        return true;
    }
    //transfer from
    function transferFrom(address _from, address _to, uint _value) public returns(bool success){

         //reqire _from has enough tokens
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
         //require allowance is big enough
        //cahnge the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //update the allowance
        allowance[_from][msg.sender] -= _value;
        //transfer event
        Transfer(_from,_to,_value);
        // return a boolean
        return true;
    }
    
}