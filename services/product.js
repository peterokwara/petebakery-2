
const Response = require("./response")
const scripts = require("../scripts/en_US.json")

class Products {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handlePayLoad(payload) {
        let response;

        switch (payload) {
            case "CAKE_PRODUCT_PAYLOAD":
                response = [
                    Response.genGenericTemplate(scripts.products.cakes)
                ]
                break;

            case "DOUGHNUT_PRODUCT_PAYLOAD":
                response = [
                    Response.genGenericTemplate(scripts.products.doughnut)
                ]
                break;
            // case "PRODUCT_1_SIZE":
            //     response = []
            //     break;

            // case "PRODUCT_2_SIZE":
            //     response = []
            //     break;

            // case "PRODUCT_1_QUANTITY":
            //     response = []
            //     break;

            // case "PRODUCT_2_QUANTITY":
            //     response = []
            //     break;

            default:
                break;
        }
    }
}

module.exports = Products