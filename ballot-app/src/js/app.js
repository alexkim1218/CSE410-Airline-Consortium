App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  seats: new Array(),
  url: 'http://127.0.0.1:7545',
  // chairPerson:null,
  // currentAccount:null,
  currentAirline:null,
  init: function() {
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);
        proposalTemplate.find('.seat-panel').text(data[i].seat).addClass('seat'+i);
        proposalsRow.append(proposalTemplate.html());

        // Remove current class from the template after appending to html
        proposalTemplate.find('.seat-panel').text(data[i].seat).removeClass('seat'+i);
        App.names.push(data[i].name);
        App.seats.push(data[i].seat);
      }
    }); 
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    //App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Consortium.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.response = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.response.setProvider(App.web3Provider);
    
    // App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    // $(document).on('click', '#win-count', App.handleWinner);
    // $(document).on('click', '#register', function(){ App.handleRegister(chairperson); });
  },

  // populateAddress : function(){
  //   new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
  //     jQuery.each(accounts,function(i){
  //       if(web3.eth.coinbase != accounts[i]){
  //         var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
  //         jQuery('#enter_address').append(optionElement);  
  //       }else {
  //         jQuery('#chairperson').append(accounts[i]);
  //       }
  //     });
  //   });
  // },

  // getChairperson : function(){
  //   App.contracts.response.deployed().then(function(instance) {
  //     return instance;
  //   }).then(function(result) {
  //     App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
  //     App.currentAccount = web3.eth.coinbase;
  //     if(App.chairPerson != App.currentAccount){
  //       jQuery('#address_div').css('display','none');
  //       jQuery('#register_div').css('display','none');
  //     }else{
  //       jQuery('#address_div').css('display','block');
  //       jQuery('#register_div').css('display','block');
  //     }
  //   })
  // },

//   handleRegister: function(addr){
//     var voteInstance;
//     const default_airline = 1;
//     App.contracts.response.deployed().then(function(instance) {
//       voteInstance = instance;
//       console.log(chairperson.textContent);
//       console.log(default_airline);
//       return voteInstance.register(chairperson.textContent, default_airline);
//     }).then(function(result, err){
//         if(result){
//             if(parseInt(result.receipt.status) == 1)
//             alert(addr + " registered")
//             else
//             alert(addr + " registration not done successfully due to revert")
//         } else {
//             alert(addr + " registration failed")
//         }   
//     });
// },

  handleVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    if( App.seats[proposalId-1] < 1) {
      alert(App.names[proposalId-1] + ' is fully booked');
    } else if (typeof currentAirline !== 'undefined' && currentAirline == proposalId-1) {
      alert('You already have this ticket');
    } else if (typeof currentAirline !== 'undefined') {
      console.log('currently', currentAirline);
      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];
        App.contracts.response.deployed().then(function(instance) {
          voteInstance = instance;
          return voteInstance.response(proposalId, {from: account});
        }).then(function(result, err){
              if(result){
                  console.log(result.receipt.status);
                  if(parseInt(result.receipt.status) == 1) {
                    alert("Account:\n" + account + "\nChanged to " + App.names[proposalId-1]);
                    jQuery('#airline').empty().append(App.names[proposalId-1]);

                    console.log('changed to', App.names[proposalId-1]);
                    App.seats[proposalId-1] -= 1;
                    console.log('seat remain', App.seats[proposalId-1]);

                    // Old airline add seat
                    App.seats[currentAirline] += 1;
                    var seat_add_back = '.seat' + currentAirline;
                    jQuery(seat_add_back).empty().append(App.seats[currentAirline]);

                    // New airline reduce seat
                    var old_seat = '.seat' + (proposalId-1);
                    jQuery(old_seat).empty().append(App.seats[proposalId-1]);
                    console.log('id to change', old_seat);
                    currentAirline = proposalId-1;
                    console.log('current airline', currentAirline);
                  }
                  else {
                    alert(account + " changing not done successfully due to revert");
                  }
              } else {
                  alert(account + " changing failed");
              }   
          });
      });
    }
    else{
      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];
        App.contracts.response.deployed().then(function(instance) {
          voteInstance = instance;
          return voteInstance.response(proposalId, {from: account});
        }).then(function(result, err){
              if(result){
                  console.log(result.receipt.status);
                  if(parseInt(result.receipt.status) == 1) {
                    alert("Account:\n" + account + "\nChanged to " + App.names[proposalId-1]);
                    jQuery('#airline').empty().append(App.names[proposalId-1]);
                    console.log('changed flight', App.names[proposalId-1]);
                    App.seats[proposalId-1] -= 1;
                    console.log('seat remain', App.seats[proposalId-1]);

                    var seat_to_change = '.seat' + (proposalId-1);
                    jQuery(seat_to_change).empty().append(App.seats[proposalId-1]);
                    console.log(seat_to_change);
                    currentAirline = proposalId-1;
                    console.log('current airline', currentAirline);
                  }
                  else {
                    alert(account + " changing not done successfully due to revert");
                  }
              } else {
                  alert(account + " changing failed");
              }   
          });
      });
    }
  },

  // handleWinner : function() {
  //   console.log("To get winner");
  //   var voteInstance;
  //   App.contracts.vote.deployed().then(function(instance) {
  //     voteInstance = instance;
  //     return voteInstance.reqWinner();
  //   }).then(function(res){
  //   console.log(res);
  //     alert(App.names[res] + "  is the winner ! :)");
  //   }).catch(function(err){
  //     console.log(err.message);
  //   })
  // }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
