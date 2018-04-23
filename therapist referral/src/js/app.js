App = {
  web3Provider: null,
  contracts: {},


  init: function() {
    // Load pets.

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    // if (typeof web3 !== 'undefined') {
    //   App.web3Provider = web3.currentProvider;
    // } else {
    //   // If no injected web3 instance is detected, fall back to Ganache
    //   App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    // }
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    web3.eth.getAccounts(function(error, accounts) {

      $.getJSON('../pets.json', function(data) {
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');

        for (i = 0; i < data.length; i ++) {
          petTemplate.find('.panel-title').text(data[i].name);
          petTemplate.find('img').attr('src', data[i].picture);
          petTemplate.find('.pet-breed').text(data[i].breed);
          petTemplate.find('.pet-age').text(data[i].age);
          petTemplate.find('.pet-location').text(data[i].location);
          petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
          petTemplate.find('.btn-adopt').attr('data-src', data[i].breed);
          petTemplate.find('.therapist').text("Address:"+accounts[i+1]);

          petsRow.append(petTemplate.html());
        }
      });

      /*web3.eth.getBalance(accounts[0], function(error, balance) {
        console.log(balance.c[0]/10000)
        $('.text-leftid').text("Available Balance: "+balance.c[0]/10000)
      })
      web3.eth.getBalance(accounts[1], function(error, balance) {
        console.log(balance.c[0]/10000)
        $('.text-left').text("Available Balance: "+balance.c[0]/10000)
      })
      web3.eth.getBalance(accounts[0], function(error, balance) {
        console.log(balance.c[0]/10000)
        $('.text-left').text("Available Balance: "+balance.c[0]/10000)
      })*/
      web3.eth.getBalance(accounts[0], function(error, balance) {
        console.log(balance.c[0]/10000);
        //var available_balance = balance.c[0]/10000;
        $('.text-left').text("Available Balance: "+balance.c[0]/10000)
      })
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
  var adoptionInstance;

  App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    return adoptionInstance.getAdopters.call();
  }).then(function(adopters) {
    for (i = 0; i < adopters.length; i++) {
      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        //web3.eth.getBalance(adopters[i], function(error, balance) {
          //console.log(balance.c[0]/10000)
          //$('.text-leftid').text("Available Balance: "+balance.c[0]/10000)
          //})
      }
    }
  }).catch(function(err) {
    console.log(err.message);
  });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('src'));

  var adoptionInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];
    var receiver1 = accounts[1];
    //console.log(balance.c[0]/10000);
    //

      var available_balance = (web3.eth.getBalance(accounts[0]))/1000000000000000000;
      var receiver_balance = (web3.eth.getBalance(accounts[2]))/1000000000000000000;
    //var account2 = "0x9d83be73c3075e7aaea0c0e75fea57485b85a2d3";


    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
     console.log(petId);
     console.log(account);
     console.log(receiver1);
     console.log(available_balance);

      // Execute adopt as a transaction by sending account
      return adoptionInstance.adopt.call(  available_balance,account,receiver1, petId ,{from: account, gasLimit: 300000});
    }).then(function(result) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = result.valueOf();
      $('.text-left').text("Available Balance: "+result.valueOf());
      // account.send(web3.toWei(1, "ether"), { gas: 100, from: account});
      console.log(receiver_balance);
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

  };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
