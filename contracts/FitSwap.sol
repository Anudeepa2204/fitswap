pragma solidity ^0.4.0;

contract FitSwap{
    //state variables
    struct User {
        string email;
        string password;
        string fname;
        string lname;
        address user_address;
        UserType user_type;
        uint active;
    }
    
    struct ExtraInfo {
        string skills;
        uint avg_rating;
        uint postal_code;
        uint number_of_customers;
    }
    enum UserType {NINJA, NOVICE}
    
    mapping(address => User) public users_list;
    mapping(address => ExtraInfo) public extra_info_list;
    mapping(address => mapping(address => User)) public customer_list;

    function register(string fname, string lname, string email, string password, uint user_type, uint postal_code, string skills) public returns(uint) {
        UserType uType;
        if(users_list[msg.sender].active == 1) { 
            return 0;
        }
        if(user_type == 1){
            uType = UserType.NINJA;
        }
        else{
            uType = UserType.NOVICE;

        }
        users_list[msg.sender] = User(email, password,fname, lname, msg.sender, uType, 1);
        extra_info_list[msg.sender] = ExtraInfo(skills,0,postal_code,0);
        return 1;
    }

    function login() public view returns (string, string, string, uint, UserType, uint, uint, uint, string){
        User memory user_data = users_list[msg.sender];
        ExtraInfo memory extra = extra_info_list[msg.sender];
        return (user_data.fname, user_data.lname, user_data.email, user_data.active, user_data.user_type, extra.avg_rating, extra.number_of_customers, extra.postal_code, extra.skills);
    }

    function customerExists(address customer_address, address user_address) private view returns (uint){
        if(customer_list[user_address][customer_address].active == 1){
            return 1;
        }
        return 0;
    }


    function getUserFromAddress(address user_a) private view returns (User){
        return (users_list[user_a]);
    }

    function addCustomer(address customer_address) public returns(uint){
        if(customerExists(customer_address, msg.sender) == 1){
            return 0;
        }
        customer_list[msg.sender][customer_address] = getUserFromAddress(customer_address);
        return 1;
    }


    function deleteCustomer(address customer_address) public returns(uint){
        if(customerExists(customer_address, msg.sender) == 1){
            delete customer_list[msg.sender][customer_address];
            return 1;
        } 
       return 0;
    }

     function giveCustomerRating(address customer_address, uint rating_value) public returns (uint){
        if(customerExists(customer_address, msg.sender) == 1){
            ExtraInfo memory extra = extra_info_list[msg.sender];
            extra_info_list[msg.sender].number_of_customers = extra.number_of_customers + 1;
            uint no_cust = extra.number_of_customers;
            extra_info_list[msg.sender].avg_rating = (extra_info_list[msg.sender].avg_rating*no_cust + rating_value)/no_cust;
            return 1;
        } 
        return 0;
    }

}
