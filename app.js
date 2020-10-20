const IotaPayment = require("./services/payment");

const iotaPayment = new IotaPayment();

const account = iotaPayment.createAccount();
iotaPayment.createPaymentLink(account, 123, "banana");
iotaPayment.accountBalance(account);
