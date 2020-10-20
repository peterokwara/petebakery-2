const config = require("./config");
const { createAccount } = require("@iota/account");
const CDA = require("@iota/cda");
const ntpClient = require("ntp-client");
const util = require("util");
const fs = require("fs");

class IotaPayment {
  constructor() {
    this.seed = config.seed;
    this.provider = config.provider;
    this.depth = config.depth;
    this.minWeightMagnitude = config.minWeightMagnitude;
    this.delay = config.delay;
    this.maxDepth = config.maxDepth;
  }

  // create a conditional deposit account for payment
  createPaymentLink(account, amount, message) {
    let magnetLink;

    // Use the Google NTP servers as a reliable source of time to check CDA timeouts
    const timeSource = () =>
      util.promisify(ntpClient.getNetworkTime)("time.google.com", 123);

    timeSource().then((time) => {
      account
        .generateCDA({
          // Set the CDA to expire after 30 seconds
          timeoutAt: time.getTime() + 60 * 1000,
        })
        .then((cda) => {
          magnetLink =
            CDA.serializeCDAMagnet(cda) +
            `&amount=${amount}&message=${message}`;
          console.log(magnetLink);
        })
        .catch((error) => {
          console.log(error);
          // Close the database and stop any ongoing reattachments
          account.stop();
        });
    });

    // export account state
    account.exportState().then((state) => {
      let JSONstate = JSON.stringify(state);
      fs.writeFile("exported-seed-state.json", JSONstate, function (
        err,
        result
      ) {
        if (err) {
          console.log("error", err);
          // Close the database and stop any ongoing reattachments
          account.stop();
        } else {
          console.log("Seed state saved");
        }
      });
    });

    return magnetLink;
  }

  createAccount() {
    // Use the Google NTP servers as a reliable source of time to check CDA timeouts
    const timeSource = () =>
      util.promisify(ntpClient.getNetworkTime)("time.google.com", 123);

    // Create an account
    const account = createAccount({
      seed: this.seed,
      provider: this.provider,
      depth: this.depth,
      minWeightMagnitude: this.minWeightMagnitude,
      delay: this.delay,
      maxDepth: this.maxDepth,
      timeSource,
    });

    return account;
  }

  accountBalance(account) {
    // be on the lookout for new payments
    account.on("includedDeposit", ({ address, bundle }) => {
      console.log("Received a new payment");
      console.log(
        "Address:",
        address,
        "Tail transaction hash:",
        bundle[0].hash
      );
    });
  }
}

module.exports = IotaPayment;
