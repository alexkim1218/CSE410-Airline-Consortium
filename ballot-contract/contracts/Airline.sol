pragma solidity ^0.5.0;

contract Consortium {

    address chairperson;

    mapping (address => uint) public airlines_map;

    constructor () public {
        chairperson = msg.sender;
        register(chairperson, 1);
    }

    function register(address user, uint airline_id) public {
        airlines_map[user] = airline_id;
    }

    function unregister(address user) public {
        airlines_map[user] = 0;
    }

    function settle_payment(uint airline_id) private {
        airlines_map[msg.sender] = airline_id;
     }

     // Airlines response to user's request by doing validation and settle payment if it's good
     function response(uint airline_requested) public {
        require(airlines_map[msg.sender] != airline_requested);
        settle_payment(airline_requested);
     }
}
