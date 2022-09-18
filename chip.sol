pragma solidity ^0.4.0;

contract supplychain{
    uint chip_id = 100;
    uint user_id = 100;
    mapping (uint => uint) count;
    mapping (address => uint) balance;
    function add_amount(address user,uint val) public  // payment gateway to deposit amount to a given users account
    {
        balance[user]+=val;
    }
    function transfer_bal(address sender,address reciever,uint amount) public  // Transfer balance from sender account to reciever account
    {
          balance[sender]-=amount;
          balance[reciever]+=amount;
    }
    function account_balance(address wallet) public view returns(uint)   // return balance to a account number entered by user
    {
        return balance[wallet];
    }
    function getchip_Id() public view returns (uint){
        return chip_id;
    }
    
    struct track
    {
        uint chpid;
        uint owner_id;
        address owner;
    }    

    mapping (uint => track[]) public tracks;
    
    function getLength(uint _cid) returns (uint) {
        return tracks[_cid].length;
    }

    function gettrack(uint cid, uint id) public returns (uint, uint , address)
    {
        track t = tracks[cid][id];
        return (t.chpid, t.owner_id, t.owner);
    }
        
    struct chip
    {
        string ctype;
        string cname;
        string cspecs;
        address ownership;
    }
    
    mapping (uint => chip) public chips;
    
    string a1 = "Design-Team" ; 
    string a2 = "Manufacturer"; 
    string a3 = "Distributor" ;  
    uint len=0;
    
    function setChip(uint sid, string types, string name, string specs) public returns (uint)
    {
        if(keccak256(users[sid].type_user) == keccak256(a1) && count[sid]<=40 && len<=68)
        {
            chip_id++ ;
            uint chp_id = chip_id;
            
            chips[chp_id].ctype = types;
            chips[chp_id].cname = name;
            chips[chp_id].ownership = users[sid].USERAddress;
            chips[chp_id].cspecs = specs;
            
            track t;
            t.chpid = chp_id;
            t.owner = users[sid].USERAddress;
            t.owner_id = sid; 
            tracks[chp_id].push(t);
            count[sid]++;
            len++;
            return chp_id;
        }
        else 
        return 0;
    } 
    
    function getChip(uint id) public view returns(string, string, address, string)
    {
        return (chips[id].ctype, chips[id].cname, chips[id].ownership, chips[id].cspecs);
    }

    //======================================================================================
    //current users of  chip
    struct current_user
    {
        string name;
        string password; 
        address USERAddress;
        string type_user;
    }
    
    mapping(uint => current_user)public users;
    function getID() public view returns(uint)
    {
        return user_id-1;
    }
    function setcurrent_user(string _name, string pass, address Add, string typeuser) public returns(uint)
    {
           uint id = user_id++ ; 
           users[id].name = _name;
           users[id].password = pass;
           users[id].USERAddress = Add;
           users[id].type_user = typeuser;
           
           return id;
    }
    
    
    
    function getcurrent_users(uint id)public view returns (string , string , address , string )
    {
        return (users[id].name,  users[id].password , users[id].USERAddress, users[id].type_user);
    }
    
    //==================================================================================
    //Login users
    function login (uint id, string pass, string types)public returns (bool){
        if(keccak256(users[id].type_user) == keccak256(types)){    
            if(keccak256(users[id].password) == keccak256(pass)){
                return true;
            }
        }
        return false;
    }
    
    
    function transferOwnershipOfChip(uint u_id1, uint u_id2, uint _cid) public returns (bool){
        current_user s1 = users[u_id1];
        current_user s2 = users[u_id2];
        track t;
        if(keccak256(s1.type_user) == keccak256(a1) && keccak256(s2.type_user) == keccak256(a2)){
            t.chpid = _cid;
            t.owner=users[u_id2].USERAddress;
            t.owner_id = u_id2;
            tracks[_cid].push(t);
            chips[_cid].ownership = s2.USERAddress;
           count[u_id1]--;
           len--;
           return (true);
        }
        else if(keccak256(s1.type_user) ==keccak256(a2) && keccak256(s2.type_user) == keccak256(a3)){
            t.chpid = _cid;
            t.owner=users[u_id2].USERAddress;
            t.owner_id = u_id2;
            tracks[_cid].push(t);
            chips[_cid].ownership = s2.USERAddress;
           return  (true);
        }
        else 
            return (false);
        
        
    }
    
    
     
}