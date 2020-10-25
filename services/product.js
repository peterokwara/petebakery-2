
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

            // Respond with what size do you want
            case "BUY_WHITE_FOREST_CAKE_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;

            case "BUY_BLACK_FOREST_CAKE_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;

            case "BUY_RED_VELVET_CAKE_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;

            case "BUY_CHOCOLATE_FROSTED_DOUGHNUT_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;

            case "BUY_STRAWBERRY_FROSTED_DOUGHNUT_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;

            case "BUY_JELLY_DOUGHNUT_PAYLOAD":
                response = [
                    Response.genQuickReply()
                ]
                break;


            default:
                break;
        }
        return response;
    }
}

module.exports = Products