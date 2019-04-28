/* 410 - Lab 2
1. Register
2. Request
3. Response
4. SettlePayment
5. Unregister
6. BalanceDetails (public - more for debugging purposes)
*/

pragma solidity ^0.5.0;

contract Consortium {

	struct airline {
        string company;
		uint seat;
		uint balance;
	}

	struct user {
        uint id;
		string username;
        uint airline_ticket;
	}

    uint public airline_count;
    uint public userCount;

    mapping (address => user) public users_map;
    mapping (uint => airline) public airlines_map;

    constructor (string memory _username) public {
        register(_username);

        // name of airline, # of seats & balance
        flight_ticket_init('ANA', 2, 487);
        flight_ticket_init('QATAR', 3, 0);
        flight_ticket_init('MalaysiaAirline', 1, 0);
    }

    /*
     * User
     */

    function register(string memory _username) private {
    	require(_username != '');
    	userCount += 1;

        // Id, Username, Airline ticket(1 = ANA)
    	users_map[msg.sender] = user(userCount, _username, 1);
    }

    function unregister(address user_address) public {
    	require(user_address != '');
        uint flight_id = users_map[user_address].airline_ticket;
        uint balance = users_map[user_address].balance;
				userCount -= 1;

        // Empty username and balance
    	users_map[user_address].username = '';
        users_map[user_address].balance = 0;

        // Airline adjustment
        airlines_map[flight_id].seat += 1;
        airlines_map[flight_id].balance += balance;
    }

    /*
     * Airline
     */

    function flight_ticket_init(string memory _name, uint _seat, uint _balance) private {
    	require(_name != '');
    	require(_balance >= 0);
    	require(_seat > 0);

    	airline_count += 1;
    	airlines_map[airline_count] = airline(_name, _seat, _balance);
    }

    function settle_payment(address user_address, uint airline_id) private {
        // Original airline
        uint original_airline_id = users_map[user_address].airline_ticket;

        // New airline
    	airlines_map[airline_id].seat -= 1;
        airlines_map[airline_id].balance += airlines_map[original_airline_id].balance;

        // Empty the old airline balance
        airlines_map[original_airline_id].balance = 0;
        airlines_map[original_airline_id].seats += 1;

        // User
        users_map[user_address].airline_ticket = airline_id;
     }

     // User sends request to airline for flight changing
     function request(address user_address, uint airline_requested) public {
        require(user_address != '');
        require(users_map[user_address].username != '');
        require(airline_requested > 0);
     }

     // Airlines response to user's request by doing validation and settle payment if it's good
     function response(address user_address, uint airline_requested) public {
        // User verification
        require(user_address != '');
        require(users_map[user_address].username != '');
        require(users_map[user_address].airline_ticket > 0);

        // Airline ticket verification
        require(airline_requested > 0);
        require(airlines_map[airline_requested].seat > 0);

        settle_payment(user_address, airline_requested);
     }

}
