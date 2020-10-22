const IotaPayment = require("./services/payment");

const iotaPayment = new IotaPayment();

const account = iotaPayment.createAccount();
const payment = iotaPayment.createPaymentLink(account, 123, "banana");
console.log("Payment link is" + payment.magnetLink);