
const Response = require("./response")
const scripts = require("../scripts/en_US.json")
const IotaPayment = require("./payment")

class Products {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handlePayLoad(payload) {
        let response;

        switch (payload) {

            // Respond with a list of cakes or dougnhuts
            case "CAKE_PRODUCT_PAYLOAD":
                response = [
                    Response.genText(scripts.products.list_cakes),
                    Response.genGenericTemplate(scripts.products.cakes)
                ]
                break;

            case "DOUGHNUT_PRODUCT_PAYLOAD":
                response = [
                    Response.genText(scripts.products.list_doughnuts),
                    Response.genGenericTemplate(scripts.products.doughnut)
                ]
                break;

            // Respond with what size do you want for cakes
            case "BUY_WHITE_FOREST_CAKE_PRODUCT_PAYLOAD":
            case "BUY_BLACK_FOREST_CAKE_PRODUCT_PAYLOAD":
            case "BUY_RED_VELVET_CAKE_PRODUCT_PAYLOAD":
                response = [
                    Response.genQuickReply(scripts.menu.cake_size, [{
                        title: scripts.menu.cake_sizes[0],
                        payload: scripts.menu.cake_sizes_payload[0]
                    }, {
                        title: scripts.menu.cake_sizes[1],
                        payload: scripts.menu.cake_sizes_payload[1]
                    }, {
                        title: scripts.menu.cake_sizes[2],
                        payload: scripts.menu.cake_sizes_payload[2]
                    }])
                ]
                break;

            // Respond with what amount of cakes do you want
            case "CAKE_PRODUCT_SIZE_1":
            case "CAKE_PRODUCT_SIZE_2":
            case "CAKE_PRODUCT_SIZE_3":
                response = [
                    Response.genQuickReply(scripts.menu.cake_amount, [{
                        title: scripts.menu.cake_amounts[0],
                        payload: scripts.menu.cake_amount_payload[0]
                    }, {
                        title: scripts.menu.cake_amounts[1],
                        payload: scripts.menu.cake_amount_payload[1]
                    }, {
                        title: scripts.menu.cake_amounts[2],
                        payload: scripts.menu.cake_amount_payload[2]
                    }])
                ]
                break;

            // Respond with what amount you want for doughnuts
            case "BUY_CHOCOLATE_FROSTED_DOUGHNUT_PRODUCT_PAYLOAD":
            case "BUY_STRAWBERRY_FROSTED_DOUGHNUT_PRODUCT_PAYLOAD":
            case "BUY_JELLY_DOUGHNUT_PRODUCT_PAYLOAD":
                response = [
                    Response.genQuickReply(scripts.menu.doughnut_amount, [{
                        title: scripts.menu.doughnut_amounts[0],
                        payload: scripts.menu.doughnut_amount_payload[0]
                    }, {
                        title: scripts.menu.doughnut_amounts[1],
                        payload: scripts.menu.doughnut_amount_payload[1]
                    }, {
                        title: scripts.menu.doughnut_amounts[2],
                        payload: scripts.menu.doughnut_amount_payload[2]
                    }])
                ]
                break;

            // Respond with payment url
            case "DOUGHNUT_PRODUCT_AMOUNT_1":
            case "DOUGHNUT_PRODUCT_AMOUNT_2":
            case "DOUGHNUT_PRODUCT_AMOUNT_3":
            case "CAKE_PRODUCT_AMOUNT_1":
            case "CAKE_PRODUCT_AMOUNT_2":
            case "CAKE_PRODUCT_AMOUNT_3":
                const iotaPayment = new IotaPayment()
                const account = iotaPayment.createAccount()
                console.log(`account is ${account}`)
                const paymentLink = iotaPayment.createPaymentLink(account,10,"hello there")
                console.log(`pay pay link is ${paymentLink}`)
                response = [
                    Response.genWebUrlButton("well, hello there!", paymentLink)
                ]
                break;

            default:
                break;
        }
        return response;
    }
}

module.exports = Products