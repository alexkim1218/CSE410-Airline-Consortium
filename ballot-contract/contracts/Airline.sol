pragma solidity ^0.5.0;

contract Consortium {

    address chairperson;

    struct user {
        uint airline;
    }

    mapping (address => user) public airlines_map;

    constructor () public {
        chairperson = msg.sender;
        register(chairperson);
    }

    function register(address user) public {
        airlines_map[user].airline = 1;
    }

    function unregister(address user) public {
        airlines_map[user].airline = 0;
    }

    function settle_payment(uint airline_id) private {
        airlines_map[msg.sender].airline = airline_id;
     }

     // Airlines response to user's request by doing validation and settle payment if it's good
     function response(uint airline_requested) public {
        if (airlines_map[msg.sender].airline == airline_requested) return;
        settle_payment(airline_requested);
     }
}
