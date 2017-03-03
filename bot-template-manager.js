//export module 
module.exports = {
    //prepare normal text to send 
    getTmplText: function(data) {
        var tmpl;

        tmpl = {
            text: data.response
        };
        return tmpl;
    },
    //prepare option list to send 
    getTmplOptionList: function(data) {
        var tmpl,
            list = [];

        for (var i = 0; i < data.options.length; i++) {
            var _obj = {
                "type": "postback",
                "title": data.options[i].name,
                "payload": data.options[i].id
            };

            list.push(_obj);
        }

        tmpl = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": data.response,
                    "buttons": list
                }
            }
        };
        return tmpl;
    },
    //prepare slider/carousel to send 
    getTmplCarouselList: function(list) {
        var tmpl;
        tmpl = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": list.options,
                }
            }
        };

        return tmpl;
    },
    //prepare generic/receipt template to send
    getTmplReceipt: function(data) {
        var tmpl;

        tmpl = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": data.details
                }
            }
        };

        return tmpl;
    },
    getTmplQuickReply: function(data) {
        var tmpl,
            list = [];

        for (var i = 0; i < data.options.length; i++) {
            var _obj = {
                "content_type": "text",
                "title": data.options[i].name,
                "payload": data.options[i].id
            };

            list.push(_obj);
        }

        tmpl = {
            "text": data.response,
            "quick_replies": list
        };
        return tmpl;
    }
}