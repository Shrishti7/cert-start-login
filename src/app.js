App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if(typeof web3!== 'undefined'){
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    }else {
      window.alert("Please connect to Metamask")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
},

loadAccount: async () => {
  App.account = web3.eth.accounts[0]
},

loadContract: async() => {
  const certify = await $.getJSON('Certify.json')
  App.contracts.Certify = TruffleContract(certify)
    App.contracts.Certify.setProvider(App.web3Provider)
    App.certify = await App.contracts.Certify.deployed()
},

render: async() => {
  if(App.loading){
    return
  }

  App.setLoading(true)

  $('#account').html(App.account)

  await App.renderTasks()

  App.setLoading(false)

},

renderTasks: async () => {
  // Load the total task count from the blockchain
      const registrationCount = await App.certify.registrationCount()
      const $template = $('.template')

      for (var i = 1; i <= registrationCount; i++) {
      // Fetch the task data from the blockchain
      const stud = await App.certify.students(i)
      const id = stud[0].toNumber()
      const name = stud[1]
      const email = stud[2]
      const wallet = stud[3]


  const $newRegister = $template.clone()
  $newRegister.find('.content').html(id +'. Name: ' + name + ' Email: ' + email)
  $newRegister.find('input')
  .prop('name',id)
  .prop('email',email)

  //Put the task in correct list
 $('#certList').append($newRegister)

  //Show the Task
  $newRegister.show()
}
},

setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load();
  })
})
