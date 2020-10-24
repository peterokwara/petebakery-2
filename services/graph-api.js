const request = require("request");
const config = require("./config")

class GraphApi {
    static callSendAPI(requestBody) {

        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: `${config.mPlatfom}/me/messages`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            error => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        )
    }
}

module.exports = GraphApi