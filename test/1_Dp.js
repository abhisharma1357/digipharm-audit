const DigipharmToken = artifacts.require('DigipharmToken.sol');
const { increaseTimeTo, duration } = require('openzeppelin-solidity/test/helpers/increaseTime');
const { latestTime } = require('openzeppelin-solidity/test/helpers/latestTime');
//var Web3 = require("web3");
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('Digipharm Token Contract', async (accounts) => {

  it('Should correctly initialize constructor values of MoonX Token Contract', async () => {

    this.tokenhold = await DigipharmToken.new({ from: accounts[0], gas: 60000000 });

  });

  it('Should check the Total Supply of DIGIPHARM TOKEN', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply, 0);//open Mint 

  });

  it('Should check the Maximum Total Supply of DIGIPHARM TOKEN', async () => {

    let MAX_TOTAL_SUPPLY = await this.tokenhold.MAX_TOTAL_SUPPLY();
    assert.equal(MAX_TOTAL_SUPPLY / 10 ** 18, 100000000);//maximum supply is fixed 

  });

  it('Should check the Name of a token of DIGIPHARM TOKEN', async () => {

    let name = await this.tokenhold.name();
    assert.equal(name, 'DIGIPHARM TOKEN');

  });

  it('Should check the symbol of a token of DIGIPHARM TOKEN', async () => {

    let symbol = await this.tokenhold.symbol();
    assert.equal(symbol, 'DPH');

  });

  it('Should check the decimal of a token of DIGIPHARM TOKEN', async () => {

    let decimal = await this.tokenhold.decimals();
    assert.equal(decimal.toNumber(), 18);

  });

  it('Should check the Owner of a DIGIPHARM TOKEN contract', async () => {

    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]);

  });

  it('Should check the balance of a Owner', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner, 0);

  });

  it('Should check transfered allowed or Not', async () => {

    let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWED, false);

  });

  it('Should not be able to Mint token by Non Owner account', async () => {

    try {
      let totalSupply = await this.tokenhold.totalSupply();
      assert.equal(totalSupply, 0);
      let balanceAccountOne = await this.tokenhold.balanceOf(accounts[1]);
      assert.equal(balanceAccountOne, 0);
      await this.tokenhold.mint(accounts[1], 100 * 10 ** 18, { from: accounts[1] });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should Mint token by Owner to Account [1]', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply, 0);
    let balanceAccountOne = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceAccountOne, 0);
    await this.tokenhold.mint(accounts[1], 100 * 10 ** 18);
    let totalSupplyLater = await this.tokenhold.totalSupply();
    assert.equal(totalSupplyLater / 10 ** 18, 100);
    let balanceAccountOneLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceAccountOneLater / 10 ** 18, 100);
  });

  it('Should check the balance of a Account [1] after minting', async () => {

    let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfAccountOne / 10 ** 18, 100);

  });

  it('Should check the Total Supply of DIGIPHARM TOKEN after Minting Token', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 100);

  });

  it('Should not be able to burn tokens of Account [1] more then account balance ', async () => {

    try {
      let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[1]);
      assert.equal(balanceOfAccountOne / 10 ** 18, 100);
      await this.tokenhold.burnFrom(101 * 10 ** 18, accounts[1], { from: accounts[0], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');

    }
  });

  it('Should not be able to burn tokens of Account [1] by Non owner Account', async () => {

    try {
      let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[1]);
      assert.equal(balanceOfAccountOne / 10 ** 18, 100);
      await this.tokenhold.burnFrom(1 * 10 ** 18, accounts[1], { from: accounts[2], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');

    }

  });

  it('Should be able to burn tokens of Account [1] by owner only', async () => {

    let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfAccountOne / 10 ** 18, 100);
    await this.tokenhold.burnFrom(1 * 10 ** 18, accounts[1], { from: accounts[0], gas: 5000000 });
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 99);
  });

  it('Should check the balance of a Account [1] after tokens burned by Owner', async () => {

    let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[1]);
    assert.equal(balanceOfAccountOne / 10 ** 18, 99);

  });

  it('Should check the Total Supply of DIGIPHARM TOKEN after tokens are burned', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 99);

  });

  it('Should be able to Mint tokens by Owner to Owner', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 99);
    let balanceOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOwner, 0);
    await this.tokenhold.mint(accounts[0], 101 * 10 ** 18);
    let totalSupplyLater = await this.tokenhold.totalSupply();
    assert.equal(totalSupplyLater / 10 ** 18, 200);
    let balanceAccountOneLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceAccountOneLater / 10 ** 18, 101);
  });

  it('Should check the balance of a Account [0] after minting', async () => {

    let balanceOfAccountOne = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfAccountOne / 10 ** 18, 101);

  });

  it('Should check the Total Supply of DIGIPHARM TOKEN after Minting Token', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 200);

  });

  it('Owner Should be able to burn tokens using function Burn', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner / 10 ** 18, 101);
    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 200);
    await this.tokenhold.burn(10 * 10 ** 18, { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater / 10 ** 18, 91);
    let totalSupplyLater = await this.tokenhold.totalSupply();
    assert.equal(totalSupplyLater / 10 ** 18, 190);

  });

  it('Should check the balance of Owner after burn ', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner / 10 ** 18, 91);

  });

  it('Should check the Total Supply of DIGIPHARM TOKEN after Burn', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 190);

  });

  it('Should be able to transfer tokens to accounts[2] by owner ', async () => {

    let balanceOfOwner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwner / 10 ** 18, 91);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfBeneficiary, 0);
    await this.tokenhold.transfer(accounts[2], 10 * 10 ** 18, { from: accounts[0], gas: 5000000 });
    let balanceOfOwnerLater = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfOwnerLater / 10 ** 18, 81);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 10);

  });

  it('Should Not be able to transfer tokens to accounts[3] by accounts[2] when transfer is Not allowed', async () => {

    try {

      let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWED, false);
      let balanceOfAccountTwo = await this.tokenhold.balanceOf(accounts[2]);
      assert.equal(balanceOfAccountTwo / 10 ** 18, 10);
      let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
      assert.equal(balanceOfBeneficiary, 0);
      await this.tokenhold.transfer(accounts[3], 1 * 10 ** 18, { from: accounts[2], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should be able to Mint tokens till maxm allowed ', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 190);
    let balanceAccountFour = await this.tokenhold.balanceOf(accounts[4]);
    assert.equal(balanceAccountFour / 10 ** 18, 0);
    await this.tokenhold.mint(accounts[4], 99999810 * 10 ** 18);
    let totalSupplyLater = await this.tokenhold.totalSupply();
    assert.equal(totalSupplyLater / 10 ** 18, 100000000);
    let balanceAccountFourLater = await this.tokenhold.balanceOf(accounts[4]);
    assert.equal(balanceAccountFourLater / 10 ** 18, 99999810);
  });

  it('Should Not be able to Mint tokens more then maxm Supply ', async () => {

    let totalSupply = await this.tokenhold.totalSupply();
    assert.equal(totalSupply / 10 ** 18, 100000000);
    await this.tokenhold.mint(accounts[5], 1 * 10 ** 18);
    let totalSupplyLater = await this.tokenhold.totalSupply();
    assert.equal(totalSupplyLater / 10 ** 18, 100000000);
    let balanceAccountFourLater = await this.tokenhold.balanceOf(accounts[5]);
    assert.equal(balanceAccountFourLater / 10 ** 18, 0);// No revert, only returns false 
  });

  it('Should Not Resume transfered allowed by Non owner Account', async () => {

    try {
      let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWED, false);
      await this.tokenhold.resumeTransfers({ from: accounts[1] });
      let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWEDLater, true);
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should Resume transfered allowed ', async () => {

    let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWED, false);
    await this.tokenhold.resumeTransfers({ from: accounts[0] });
    let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDLater, true);
  });

  it('Should be able to transfer tokens to accounts[5] by non Owner account when transfer allowed ', async () => {

    let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDLater, true);
    let balanceOfAccountTwo = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfAccountTwo / 10 ** 18, 10);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[5]);
    assert.equal(balanceOfBeneficiary, 0);
    await this.tokenhold.transfer(accounts[5], 1 * 10 ** 18, { from: accounts[2], gas: 5000000 });
    let balanceOfAccountTwoLater = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfAccountTwoLater / 10 ** 18, 9);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[5]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 1);

  });

  //state of this variable can also be update automatically when laste token will be minted
  it('Should check minting finished or not when total supply is equal to maxm supply', async () => {

    let mintingFinished = await this.tokenhold.mintingFinished();
    assert.equal(mintingFinished, false);

  });

  it('Should Not update state of minting finish by Non owner Account', async () => {

    try {
      let mintingFinished = await this.tokenhold.mintingFinished();
      assert.equal(mintingFinished, false);
      await this.tokenhold.finishMinting({ from: accounts[1] });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
  });

  it('Should update state of minting finish ', async () => {

    let mintingFinished = await this.tokenhold.mintingFinished();
    assert.equal(mintingFinished, false);
    await this.tokenhold.finishMinting({ from: accounts[0] });
    let mintingFinishedLater = await this.tokenhold.mintingFinished();
    assert.equal(mintingFinishedLater, true);

  });

  it('Should Not Stop transfer functionality by Non Owner Account', async () => {

    try {
      let TRANSFERS_ALLOWEDNow = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWEDNow, true);
      await this.tokenhold.stopTransfers({ from: accounts[1] });
      let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWEDLater, false);
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should Stop transfer functionality by owner Account', async () => {

    let TRANSFERS_ALLOWEDNow = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDNow, true);
    await this.tokenhold.stopTransfers({ from: accounts[0] });
    let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDLater, false);
  });

  it('Should Not be able to transfer tokens to accounts[3] by accounts[2] when transfer is Not allowed', async () => {

    try {

      let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWED, false);
      let balanceOfAccountTwo = await this.tokenhold.balanceOf(accounts[2]);
      assert.equal(balanceOfAccountTwo / 10 ** 18, 9);
      let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
      assert.equal(balanceOfBeneficiary, 0);
      await this.tokenhold.transfer(accounts[3], 1 * 10 ** 18, { from: accounts[2], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should Not Resume transfer functionality by Non Account', async () => {

    try {
      let TRANSFERS_ALLOWEDNow = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWEDNow, false);
      await this.tokenhold.resumeTransfers({ from: accounts[1] });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should Resume transfer functionality by owner Account', async () => {

    let TRANSFERS_ALLOWEDNow = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDNow, false);
    await this.tokenhold.resumeTransfers({ from: accounts[0] });
    let TRANSFERS_ALLOWEDLater = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWEDLater, true);
  });

  it("should Approve address[5] to spend specific token on the behalf of accounts[3]", async () => {

    this.tokenhold.approve(accounts[3], 2 * 10 ** 18, { from: accounts[2] });
    let allowance = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowance / 10 ** 18, 2, "allowance is wrong when approve");

  });

  it('Should Not be able to transfer tokens more then allowance figure', async () => {

    try {
      let balanceOfAccountTwo = await this.tokenhold.balanceOf(accounts[2]);
      assert.equal(balanceOfAccountTwo / 10 ** 18, 9);
      let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
      assert.equal(balanceOfBeneficiary / 10 ** 18, 0);
      await this.tokenhold.transferFrom(accounts[2], accounts[3], 3 * 10 ** 18, { from: accounts[3], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should be able to transfer tokens to accounts[3] it self after approval from accounts[2]', async () => {

    let balanceOfAccountTwo = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfAccountTwo / 10 ** 18, 9);
    let balanceOfBeneficiary = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiary / 10 ** 18, 0);
    await this.tokenhold.transferFrom(accounts[2], accounts[3], 1 * 10 ** 18, { from: accounts[3], gas: 5000000 });
    let balanceOfTwoLater = await this.tokenhold.balanceOf(accounts[2]);
    assert.equal(balanceOfTwoLater / 10 ** 18, 8);
    let balanceOfBeneficiaryLater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfBeneficiaryLater / 10 ** 18, 1);
  });

  it("should check the allownce after transfering tokens on the behalf of accounts[2]", async () => {

    let allowance = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowance / 10 ** 18, 1, "allowance is wrong when approve");

  });

  it("should increase the allownce ", async () => {

    let allowance = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowance / 10 ** 18, 1, "allowance is wrong when approve");
    await this.tokenhold.increaseApproval(accounts[3], 1 * 10 ** 18, { from: accounts[2] });
    let allowanceLater = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowanceLater / 10 ** 18, 2, "allowance is wrong when approve");
  });

  it("should decrease the allownce ", async () => {

    let allowance = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowance / 10 ** 18, 2, "allowance is wrong when approve");
    await this.tokenhold.decreaseApproval(accounts[3], 1 * 10 ** 18, { from: accounts[2] });
    let allowanceLater = await this.tokenhold.allowance.call(accounts[2], accounts[3]);
    assert.equal(allowanceLater / 10 ** 18, 1, "allowance is wrong when approve");
  });

  it("Should Not be able to transfer ownership of Digipharma token Contract from Non Owner Account", async () => {

    try {
      let owner = await this.tokenhold.owner();
      assert.equal(owner, accounts[0]);
      await this.tokenhold.transferOwnership(accounts[9], { from: accounts[1] });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }
  });

  it("Should be able to transfer ownership of Digipharma token Contract ", async () => {

    let owner = await this.tokenhold.owner();
    assert.equal(owner, accounts[0]);
    await this.tokenhold.transferOwnership(accounts[9], { from: accounts[0] });
    let newOwner = await this.tokenhold.owner();
    assert.equal(newOwner, accounts[9]);
  });

  it("Should be able to check if user can transfer tokens or not(Failed)", async () => {

    let balanceOfvictim = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfvictim / 10 ** 18, 1);
    canBeTransfered = await this.tokenhold.canBeTransfered(accounts[3], 1 * 10 ** 18);
    assert.equal(canBeTransfered,true);
  });

  it("Should be able to lock tokens of accounts[3] for particular period of time", async () => {

    let balanceOfvictim = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfvictim / 10 ** 18, 1);
    this.openingTime = (await latestTime());
    let lockStarttime = this.openingTime;
    await this.tokenhold.lock(accounts[3], lockStarttime + duration.seconds(86400), 1 * 10 ** 18 / 2, { from: accounts[9] });

  });

  it('Should Not be able to transfer tokens to accounts[2] by accounts[3] when lock', async () => {

    try {
      let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
      assert.equal(TRANSFERS_ALLOWED, true);
      let balanceOfAccountThree = await this.tokenhold.balanceOf(accounts[3]);
      assert.equal(balanceOfAccountThree / 10 ** 18, 1);
      canBeTransfered = await this.tokenhold.canBeTransfered(accounts[3], 1 * 10 ** 18);
      await this.tokenhold.transfer(accounts[2], 1 * 10 ** 18, { from: accounts[3], gas: 5000000 });
    } catch (error) {
      var error_ = 'VM Exception while processing transaction: revert';
      assert.equal(error.message, error_, 'Reverted ');
    }

  });

  it('Should be able to transfer tokens to accounts[2] by accounts[3] when locked but value less then locked value', async () => {


    let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWED, true);
    let balanceOfAccountThree = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThree / 10 ** 18, 1);
    canBeTransfered = await this.tokenhold.canBeTransfered(accounts[3], 1 * 10 ** 18);
    let locks = await this.tokenhold.locks(0);
    assert.equal(locks[1], accounts[3]);
    await this.tokenhold.transfer(accounts[2], 1 * 10 ** 18 / 5, { from: accounts[3], gas: 5000000 });
    let balanceOfAccountThreelater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThreelater, ((1 * 10 ** 18) * 4) / 5);

  });

  it('Should transfer tokens to account[3] to check token transfer after lock period ', async () => {

    let balanceOfowner = await this.tokenhold.balanceOf(accounts[0]);
    assert.equal(balanceOfowner/ 10 ** 18, 81);
    let balanceOfAccountThree = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThree, ((1 * 10 ** 18) * 4) / 5);
    await this.tokenhold.transfer(accounts[3], 10 * 10 ** 18, { from: accounts[0], gas: 5000000 });
    let balanceOfAccountThreelater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThreelater/10**18,10.8);

  });

  it('Should be able to transfer tokens to accounts[2] by accounts[3] when locked Period is over', async () => {


    let TRANSFERS_ALLOWED = await this.tokenhold.TRANSFERS_ALLOWED();
    assert.equal(TRANSFERS_ALLOWED, true);
    let balanceOfAccountThree = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThree / 10 ** 18, 10.8);
    let locks = await this.tokenhold.locks(0);
    assert.equal(locks[1], accounts[3]);
    this.openingTime = (await latestTime());
    assert.isAbove(locks[0].toNumber(),this.openingTime,'release time is Higher then current time');
    await increaseTimeTo(this.openingTime + duration.seconds(86400));
    this.openingTimelater = (await latestTime());
    assert.isAbove(this.openingTimelater,locks[0].toNumber(),'release time is lower then current time');
    await this.tokenhold.transfer(accounts[2], 2 * 10 ** 18 , { from: accounts[3], gas: 5000000 });
    let balanceOfAccountThreelater = await this.tokenhold.balanceOf(accounts[3]);
    assert.equal(balanceOfAccountThreelater/10**18,8.8);

  });


})
