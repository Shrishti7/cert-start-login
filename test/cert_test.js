const Certify = artifacts.require("./Certify.sol");

contract('Certify', (accounts) => {
    before(async () => {
      this.certify = await Certify.deployed()
    })

    it('deploys successfully', async() => {
      const address = await this.certify.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('lists registrations', async () => {
       const registrationCount = await this.certify.registrationCount()
       const cert = await this.certify.students(registrationCount)
       assert.equal(cert.id.toNumber(), registrationCount.toNumber())
       assert.equal(cert.name, 'Shrishti')
       assert.equal(cert.email, 'shrishtig797@gmail.com')
       assert.equal(registrationCount.toNumber(), 1)
     })

   it('registers successfully', async () => {
      const result = await this.certify.Register('A new name', 'A new email')
      const registrationCount = await this.certify.registrationCount()
      assert.equal(registrationCount, 2)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), 2)
      assert.equal(event.name, 'A new name')
      assert.equal(event.email, 'A new email')
    })

})
