const express = require("express")
const crypto = require("crypto")
const bodyParser = require("body-parser")
const config = require("./services/config")
const Receive = require("./services/receive")
const User = require("./services/user")
const GraphAPi = require("./services/graph-api")

const app = express()
let users = {}

app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"]
    let token = req.query["hub.verify_token"]
    let challenge = req.query["hub.challenge"]

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === config.verifyToken) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED")
            res.status(200).send(challenge)
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403)
        }
    }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === "page") {

        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");

        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];

            // Discard uninteresting events
            if ("read" in webhookEvent) {
                // console.log("Got a read event");
                return;
            }

            if ("delivery" in webhookEvent) {
                // console.log("Got a delivery event");
                return;
            }

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            if (!(senderPsid in users)) {
                let user = new User(senderPsid)

                GraphAPi.getUserProfile(senderPsid)
                    .then(userProfile => {
                        user.setProfile(userProfile)
                    })
                    .catch(error => {
                        console.log("Profile is unavailable:", error)
                    })
                    .finally(() => {
                        users[senderPsid] = user
                    })
                let receiveMessage = new Receive(users[senderPsid], webhookEvent)
                return receiveMessage.handleMessage()
            }

            let receiveMessage = new Receive(users[senderPsid], webhookEvent);
            return receiveMessage.handleMessage();
        })
    } else {
        res.sendStatus(404)
    }

});

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        console.log("Couldn't validate the signature.");
    } else {
        var elements = signature.split("=");
        var signatureHash = elements[1];
        var expectedHash = crypto
            .createHmac("sha1", config.appSecret)
            .update(buf)
            .digest("hex");
        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

var listener = app.listen(config.port, function () {
    console.log("Your app is listening on port " + listener.address().port)
})
