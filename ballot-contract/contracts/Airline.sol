pragma solidity ^0.5.0;

contract Consortium {

    address chairperson;

    struct user {
        uint airline;
    }

    mapping (address => user) public airlines_map;

    constructor () public {
        chairperson = msg.sender;
        register(chairperson, 1);
    }

    function register(address _user, uint airline_id) public {
        airlines_map[_user].airline = airline_id;
    }

    function unregister(address _user) public {
        airlines_map[_user].airline = 0;
    }

    function settle_payment(uint airline_id) private {
        airlines_map[msg.sender].airline = airline_id;
     }

     // Airlines response to user's request by doing validation and settle payment if it's good
     function response(uint airline_requested) public {
        //require(airline_requested > 0);
        if (airlines_map[msg.sender].airline == airline_requested) return;
        else { settle_payment(airline_requested); }
     }
}
