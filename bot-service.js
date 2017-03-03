//load modules
var request = require('request');
var jsonfile = require('jsonfile');
var template = require('./bot-template-manager');
var firebaseHelper = require('./bot-database-helper');

//global variables
var tmplType = {
    "text": "getTmplText",
    "optionList": "getTmplOptionList",
    "carouselList": "getTmplCarouselList",
    "receipt": "getTmplReceipt",
    "quickReply": "getTmplQuickReply"
};

//export modules
module.exports = {
    //Set questions every hour
    getQuestions : function(isFirebaseDB) {

        //is firebase database enabled
        if(isFirebaseDB){
            var questionsPromise = firebaseHelper.getQuestionsList();  
            return questionsPromise;
        }else{
            return require('./bot-dummy-database-object.json'); //load static question - Demo purpose only
        }
        
    },

    //save chat conversation 
    saveChatObj: function(key, userObj, CONFIG, data,answer) {
        //create chat object
        var chatDataObj = {
            "userId": userObj.userId,
            "question": data.response,
            "answer": answer,
            "key": data.key
        };

        //save to firebase
        firebaseHelper.saveChat(chatDataObj);
    },
    //Prepare custom list like carousel,  
    prepareCustomList: function(list) {
        var objList = [];

        for (var i = 0, j = 1; i < list.length; i++, j++) {
            var obj = {
                "title": list[i].name,
                "image_url": list[i].image,
                "subtitle": list[i].subtitle,
                "buttons": [{
                    "type": "postback",
                    "payload": j,
                    "title": "Select Meal"
                }]
            };
            objList.push(obj);
        }
        return objList;
    },
    //Send message to end user 
    sendMessage: function(message, userObj, CONFIG, data,answer) {

        var _this = this,
            userName = userObj.profile ? userObj.profile.first_name : "there",
            tmplData = template[tmplType[data.tType]](data, userName);

        //set user details 
        if (message === "welcome_greeting") {
            tmplData.text = tmplData.text.replace('<user>', userName);
        }

        //set selected restaurant name and photo
        else if (message === "confirmation" || message === "receipt") {
            tmplData.attachment.payload.elements[0].subtitle = tmplData.attachment.payload.elements[0].subtitle.replace('<restaurant>', userObj.selectedRestaurantName);
            tmplData.attachment.payload.elements[0].subtitle = tmplData.attachment.payload.elements[0].subtitle.replace('<day>', userObj.selectedDay);
            tmplData.attachment.payload.elements[0].image_url = userObj.selectedRestaurantImage;
        }

        //in case of favuorite restaurant and meal 
        else if (message === "confirmation_order" || message === "receipt_order") {
            tmplData.attachment.payload.elements[0].subtitle = tmplData.attachment.payload.elements[0].subtitle.replace('<restaurant>', userObj.selectedRestaurantName);
            tmplData.attachment.payload.elements[0].subtitle = tmplData.attachment.payload.elements[0].subtitle.replace('<meal>', userObj.selectedMealName);
            tmplData.attachment.payload.elements[0].image_url = userObj.selectedMealImage;
        }

        return request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: CONFIG.accessToken
            },
            method: 'POST',
            json: {
                "recipient": {
                    id: userObj.userId
                }, //set user id 
                "message": tmplData, //set template with dynamic data
            }
        }, function(error, response, body) {

            if (error) {
                console.log('Error sending messages: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            } else {
                //save chat to firebase, if database enabled
                if(CONFIG.isFirebaseDB){
                    _this.saveChatObj(message,userObj, CONFIG,data,answer);
                }
                console.log('Message sent');
            }
        })
    },
    //send quick and plain text message, like notification etc...
    sendPlainMessage: function(userId, CONFIG, msg) {

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: CONFIG.accessToken
            },
            method: 'POST',
            json: {
                recipient: {
                    id: userId
                }, //set user id 
                message: {
                    text: msg
                } //set message
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            } else {
                console.log('Message sent');
            }
        });
    }
};