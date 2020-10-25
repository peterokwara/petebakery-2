const scripts = require("../scripts/en_US.json")

class Response {

    static genGenericTemplate(content) {
        let response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        content
                    ]
                }
            }
        };

        return response;
    }

    static genQuickReply(text, quickReplies) {
        let response = {
            text: text,
            quick_replies: []
        };

        for (let quickReply of quickReplies) {
            response["quick_replies"].push({
                content_type: "text",
                title: quickReply["title"],
                payload: quickReply["payload"]
            });
        }

        return response;
    }

    static genText(text) {
        let response = {
            text: text
        };

        return response;
    }

    static genNuxMessage(user) {
        let welcome = this.genText(
            scripts.get_started.welcome, {
            userFirstName: user.firstName
        })


        let guide = this.genText(scripts.get_started.guidance);

        let curation = this.genQuickReply(scripts.get_started.help, [
            {
                title: scripts.menu.product_1,
                payload: "CAKE_PRODUCT_PAYLOAD"
            }, {
                title: scripts.menu.product_2,
                payload: "DOUGHNUT_PRODUCT_PAYLOAD"
            }
        ])

        return [welcome, guide, curation];
    }
}

module.exports = Response