App = {
      web3Provider: null,
      contracts: {},
      account: 0x0,
      owner: 0x0,

      init: function () {
            return App.initWeb3();
      },

      initWeb3: function () {
            // initialize web3
            if (typeof web3 !== 'undefined') {
                  //reuse the provider of the Web3 object injected by Metamask
                  App.web3Provider = web3.currentProvider;
            } else {
                  //create a new provider and plug it directly into our local node
                  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            }
            web3 = new Web3(App.web3Provider);
            App.owner = web3.eth.accounts[0];
            App.account = web3.eth.accounts[1];
            //   App.displayAccountInfo();

            web3.eth.getAccounts(function (err, accounts) {
                  if (err != null) console.error("An error occurred: " + err);
                  else if (accounts.length == 0) console.log("User is not logged in to MetaMask");
                  else {
                        console.log("User is logged in to MetaMask " + accounts);
                  }
            });
            return App.initContract();
      },

      loginUser: function () {
            event.preventDefault();
            var _email = $('#email').val();
            var _pass = $('#password').val();
            App.contracts.FitSwap.deployed().then(function (instance) {
                  return instance.login(_email, _pass, {
                        from: App.account,
                        gas: 500000
                  });
            }).then(function (result) {
                  if (result[0].length == 0) {
                        alert("you have not registered yet, Please signup and come back!!");
                        window.location.href = '/templates/register.html';
                  }
                  else {
                        if (result[2] != _email || result[4] != _pass) {
                              alert("Invlaid user name or password!!");
                              window.location.reload(false);
                        }
                        else {
                              alert("login success!!");
                              if (typeof (Storage) !== "undefined") {
                                    localStorage.setItem("fname", result[0]);
                                    localStorage.setItem("lname", result[1]);
                                    localStorage.setItem("email", result[2]);
                                    localStorage.setItem("account", App.account);
                                    web3.eth.getBalance(App.account, function (err, balance) {
                                          if (err === null) {
                                                localStorage.setItem("balance", web3.fromWei(balance, "ether"));
                                          }

                                    })
                              }
                        }

                  }

            }).catch(function (err) {
                  console.error(err);
            });

      },

      addCustomer: function(){
            _address = 'get the address';
            App.contracts.Customer.deployed().then(function(app){
                  return app.addCustomer(address,{
                        from: App.account,
                        gas: 500000  
                  });
            }).then(function(result){
                  if(!result || result[0] == 0){
                        console.log("error")
                        alert("Please add the service again");
                  }else{
                        alert("service added successfully");
                  }
            });

      },

      registerUsers:function(){
            App.contracts.FitSwap.deployed().then(function(app){
                  return app.register(_fname, _lname, _email, _pass, _type, _skill, {
                        from: App.account,
                        gas: 500000  
                  });
            }).then(function(result){
                  if(!result || result[0] == 0){
                        console.log("error")
                        alert("Please register again");
                  }else{
                        alert("registration successful")
                        window.location.href = '/index.html';
                  }
            })
      },


      renderPolicies: function(result){
                                  var pol = Number(result[4]) + 1;
                                  var id = Number(result[4]) + 23*Number(result[4]) + 4200881493;
                                  //
                                  debugger;
                                   localStorage.setItem("pprice_c", pol);
                                   localStorage.setItem("pid_c", "Policy id: " + id);
                                  if(pol == 1){
                                    //Silver
                                    if (typeof (Storage) !== "undefined") {
                                          localStorage.setItem("phead_c", "Silver");
                                          localStorage.setItem("pname_c", "Policy name: Ethereum Insurance");
                                          localStorage.setItem("pcover_c", "Ξ 3 Coverage");
                                          localStorage.setItem("pval_c", "5 Months Validity");
                                          localStorage.setItem("pregion_c", "Valid within United States");
                                  }
                                }
                                  else if (pol == 2){
                                    //Gold
                                    if (typeof (Storage) !== "undefined") {
                                          localStorage.setItem("phead_c", "Gold");
                                          localStorage.setItem("pname_c", "Policy name: Ethereum Insurance");
                                          localStorage.setItem("pcover_c", "Ξ 6 Coverage");
                                          localStorage.setItem("pval_c", "11 Months Validity");
                                          localStorage.setItem("pregion_c", "Valid within United States and other few countries");
                                  }
                                }
                                  else if  (pol == 3){
                                    //Platinum
                                    if (typeof (Storage) !== "undefined") {
                                          localStorage.setItem("phead_c", "Platinum");
                                          localStorage.setItem("pname_c", "Policy name: Ethereum Insurance");
                                          localStorage.setItem("pcover_c", "Ξ 9 Coverage");
                                          localStorage.setItem("pval_c", "1.2 Years Validity");
                                          localStorage.setItem("pregion_c", "Valid all around the world");
                                  }
                                  }

                                  window.location.href = '/templates/claim.html';



                                  alert("policy bought!!");
           },

           getUserByAddress:function(add, callback){
                       App.contracts.Insurance.deployed().then(function (instance) {
                             return instance.get_user_by_address(add, {
                                   from: App.account,
                                   gas: 500000
                             });
                       }).then(function (result) {
                             callback(result)
                       }).catch(function (err) {
                             console.error(err);
                       });
                 },

                 registerUser: function () {
                       event.preventDefault();
                       // retrieve the detail of the article
                       var _fname = $('#f_name').val();
                       var _lname = $('#l_name').val();
                       var _email = $('#r_email').val();
                       var _pass = $('#r_password').val();
                       App.contracts.Insurance.deployed().then(function (instance) {
                             instance.register(_fname, _lname, _email, _pass, {
                                   from: App.account,
                                   gas: 500000
                             });
                       }).then(function (result) {
                             console.log("after getting res");
                             alert("registration success!!");
                             window.location.href = '/index.html';
                       }).catch(function (err) {
                             console.error(err);
                       });
                 },



      claimMoney: function (_pt) {
            event.preventDefault();
            App.contracts.Insurance.deployed().then(function (instance) {
                  instance.claim_money(App.account, {
                        from: App.owner,
                        gas: 500000,
                        value: Number(web3.toWei((3 * _pt), "ether"))
                  });
            }).then(function (result) {
                  console.log("after getting claim res");
                  alert("claim successful!!");
                  if (typeof (Storage) !== "undefined") {
                        web3.eth.getBalance(App.account, function (err, balance) {
                              if (err === null) {
                                    localStorage.setItem("balance", web3.fromWei(balance, "ether"));
                              }
                              window.location.href = "../templates/homepage.html";s
                        })
                  }
                  //  window.location.href = '/index.html';
            }).catch(function (err) {
                  console.error(err);
            });
      },



      initContract: function () {
            $.getJSON('../Insurance.json', function (InsuranceArtifact) {
                  // get the contract artifact file and use it to instantiate a truffle contract abstraction
                  App.contracts.Insurance = TruffleContract(InsuranceArtifact);
                  // set the provider for our contracts
                  App.contracts.Insurance.setProvider(App.web3Provider);
                  // retrieve the article from the contract
                  //     return App.reloadArticles();
            });
      },
      getInstance: function () {
            return App.contracts.Insurance;
      }

};

$(function () {
      $(window).load(function () {
            App.init();
      });
});

