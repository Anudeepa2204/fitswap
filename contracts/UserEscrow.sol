pragma solidity ^0.4.24;

contract UserEscrow{
    
    uint[] ether_users;
    address[] address_users;
    string[] pass_set;
    string [] pass_enter;
    bool flag = false;
    string sum;
    
    constructor() public {
    
    }
    
    function setPassword(string _password) public payable{
        require(ether_users.length < 3);
        pass_set.push(_password);
        ether_users.push(msg.value);
        address_users.push(msg.sender);
    }
    
    function contractBalance() public view returns(uint){
        require(ether_users.length<3);
        return address(this).balance;
    }
    
    function enterPasswordtoReleaseFunds(string _pass) public {
        require(ether_users.length<3);
        pass_enter.push(_pass);
    }
    
    function executeContract() public {
        require(ether_users.length<3);
        
        if (ether_users[0] == ether_users[1]){
            if(keccak256(pass_set[0]) == keccak256(pass_enter[0]) || keccak256(pass_set[0]) == keccak256(pass_enter[1])){
                if(keccak256(pass_set[1]) == keccak256(pass_enter[0]) || keccak256(pass_set[1]) == keccak256(pass_enter[1])){
                    flag = true;    
            }
        }    
    }
        
        if(flag){
            address_users[0].transfer(ether_users[0]);
            address_users[1].transfer(ether_users[1]);
        }
    
    }
    
    
}

