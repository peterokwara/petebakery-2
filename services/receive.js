const GraphApi = require("./graph-api")
const scripts = require("../scripts/en_US.json")
const Response = require("./response")
const Product = require("./product")

class Receive {
    constructor(user, webhookEvent) {
        this.user = user
        this.webhookEvent = webhookEvent
    }

    handleMessage() {
        let event = this.webhookEvent;

        let responses;

        try {
            if (event.message) {
                let message = event.message;

                if (message.quick_reply) {
                    responses = this.handleQuickReply();
                }
                if (message.text) {
                    responses = this.handleTextMessage()
                }
            }

            if (event.postback) {
                responses = this.handlePostback()
            }

        } catch (error) {
            console.error(error);
            responses = {
                text: `An error has occured: '${error}'. We have been notified and \
              will fix the issue shortly!`
            };
        }

        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        } else {
            this.sendMessage(responses);
        }
    }

    // Handles mesage events with quick replies
    handleQuickReply() {
        // Get the payload of the quick reply
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    handleTextMessage() {
        console.log(
            "Received text:",
            `${this.webhookEvent.message.text} for ${this.user.psid}`
        );

        if (this.webhookEvent.message.text == "hello") {
            return Response.genNuxMessage(this.user)
        }

        return Response.genText("hello");
    }

    handlePayload(payload) {
        console.log("Received Payload:", `${payload} for ${this.user.psid}`);

        // Log CTA event in FBA
        // GraphApi.callFBAEventsAPI(this.user.psid, payload);

        let response;

        if (payload === "GET_STARTED") {
            response = Response.genNuxMessage(this.user);
        } else if (payload.includes("CAKE_PRODUCT_PAYLOAD")) {
            let product = new Product(this.user, this.webhookEvent)
            response = product.handlePayLoad(payload)
        } else if (payload.includes("DOUGHNUT_PRODUCT_PAYLOAD")) {
            let product = new Product(this.user, this.webhookEvent)
            response = product.handlePayLoad(payload)
        } else {
            response = {
                text: `This is a default postback message for payload: ${payload}!`
            };
        }

        return response;

    }

    // Handles postbacks events
    handlePostback() {
        let postback = this.webhookEvent.postback;
        // Check for the special Get Starded with referral
        let payload;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            payload = postback.referral.ref;
        } else {
            // Get the payload of the postback
            payload = postback.payload;
        }
        return this.handlePayload(payload.toUpperCase());
    }

    sendMessage(response, delay = 0) {
        // Check if there is delay in the response
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        // Construct the message body
        let requestBody = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };

        // Check if there is persona id in the response
        if ("persona_id" in response) {
            let persona_id = response["persona_id"];
            delete response["persona_id"];

            requestBody = {
                recipient: {
                    id: this.user.psid
                },
                message: response,
                persona_id: persona_id
            };
        }

        setTimeout(() => GraphApi.callSendAPI(requestBody), delay);
    }
}

module.exports = Receive;