const config = require("./config");
const { createAccount } = require('@iota/account');
const CDA = require("@iota/cda");
const ntpClient = require("ntp-client");
const util = require("util");
const Response = require("./response");

class IotaPayment {

  constructor() {
    this.seed = config.seed;
    this.provider = config.provider;
    this.depth = config.depth;
    this.minWeightMagnitude = config.minWeightMagnitude;
    this.delay = config.delay;
    this.maxDepth = config.maxDepth;
    this.timeSource = () => util.promisify(ntpClient.getNetworkTime)('time.google.com', 123);
  }

  // create a conditional deposit account for payment
  async createPaymentLink(account, amount, message) {
    let magnetLink;
    let paymentAddress;

    await this.timeSource().then(((time) => {
      account.generateCDA({
        // Set the CDA to expire tomorrow
        timeoutAt: time.getTime() + 30 * 1000
      }).then((cda) => {
        magnetLink = `${CDA.serializeCDAMagnet(cda)}&amount=${amount}&message=${message}`;
        paymentAddress = magnetLink.slice(7, 88);
        // console.log(magnetLink);
        console.log(`Address is ${paymentAddress} magnet link is ${magnetLink}`);
      }).then((magnetLink) => {
        return magnetLink;
      }).catch((error) => {
        console.log(error);
        // Close the database and stop any ongoing reattachments
        account.stop();
      })
    }))

    account.on('includedDeposit', ({ address, bundle }) => {

      if (address == paymentAddress) {
        console.log("priiicks so many pricks")
      }
      console.log('Received a new payment')
      console.log('Address:', address, 'Tail transaction hash:', bundle[0].hash);
    });

    return magnetLink;
  }

  createAccount() {
    // Create an account
    const account = createAccount({
      seed: this.seed,
      provider: this.provider,
      depth: this.depth,
      minWeightMagnitude: this.minWeightMagnitude,
      delay: this.delay,
      maxDepth: this.maxDepth,
      timeSource: this.timeSource,
    });

    return account;
  }

}

module.exports = IotaPayment;
