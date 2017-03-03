var service = require('./bot-service');
var _ = require('underscore');
var CONFIG = require('./bot-config');
var WIT = require('wit-js');
var client = new WIT.Client({
    apiToken: CONFIG.witToken
});
var autoReplyKeys = ['comments', 'no_of_people', 'day_and_time'];

module.exports = {
    autoReply: function(text, userObj, responseList,text) {
        var _this = this;

        //ask for user fedback and comments 
        if (userObj.lastQuestionKey === 'comments') {

            _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['comments'], 'comments',text);
            userObj.lastQuestionKey = ""; //reset last key 

            //ask for day and time of reservation    
        } else if (userObj.lastQuestionKey === 'no_of_people') {

            _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['day_and_time'], 'day_and_time',text);

            //ask for reservation length    
        } else if (userObj.lastQuestionKey === 'day_and_time') {


            userObj.selectedDay = text; //set day to user session object
            _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['reservation_length'], 'day_and_time',text);
        }
    },
    handleRequest: function(event, userObj, responseList) {
        var _this = this;

        //handle response if normal message received
        if (event.message) {
            /***** MESSAGE ATTACHMENT EVENT ****/
            if (event.message.text) {

                //get message
                var text = event.message.text;

                //Send thanks greeting when comments received
                if (_.contains(autoReplyKeys, userObj.lastQuestionKey)) {

                    //get next question without NPL 
                    _this.autoReply(text, userObj, responseList,text);
                } else {

                    //Send message to WIT                
                    client.message(text, {})
                        .then(function(witKey) {

                            //Get response
                            var _key = witKey.entities.intent ? witKey.entities.intent[0].value : '',
                                data = _.findWhere(responseList, {
                                    key: CONFIG.keyMapped[_key]
                                }),
                                intentConfidence = witKey.entities.intent ? witKey.entities.intent[0].confidence : 0;

                            if (data && intentConfidence > 0.5) {

                                //ask next question
                                _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped[_key], _key,text);

                                if (CONFIG.keyMapped[_key] === "welcome_greeting") {

                                    //show initial menu
                                    _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['select_menu'], 'select_menu',text);
                                }
                            } else {
                                //send default messsage
                                service.sendPlainMessage(userObj.userId, CONFIG, CONFIG.defaultQueryMsg);
                            }
                        })
                        .catch(function(err) {
                            console.log("WIT reponse fails", err);
                        });
                }
            }
        }
        //Handle postbask reponse             
        else if (event.postback) {

            var nextQuestion,
                textPayload = event.postback.payload;

            //set last selected question key 
            userObj.lastQuestionKey = textPayload;

            //Set user selected restaurant details
            if (textPayload === "restaurant_1" || textPayload === "restaurant_2" || textPayload === "restaurant_3") {
                var _data = _this.getRestaurantDetails(responseList, textPayload, 'select_restaurant');
                userObj.selectedRestaurantName = _data.title;
                userObj.selectedRestaurantImage = _data.image_url;
            }

            //get user selected restaurant name, in case of favourite selection
            else if (textPayload === "restaurant_cousine_1" || textPayload === "restaurant_cousine_2" || textPayload === "restaurant_cousine_3") {
                var _data = _this.getRestaurantDetails(responseList, textPayload, 'select_restaurant_cousine');
                userObj.selectedRestaurantName = _data.title;
                userObj.selectedRestaurantImage = _data.image_url;
            }

            //get user selected meal name, in case of favourite selection
            else if (textPayload === "meal_1" || textPayload === "meal_2" || textPayload === "meal_3" || textPayload === "meal_4" || textPayload === "meal_5" || textPayload === "meal_6") {
                var _data = _this.getMealDetails(responseList, textPayload);
                userObj.selectedMealName = _data.title;
                userObj.selectedMealImage = _data.image_url;
            }

            //send message
            nextQuestion = _.findWhere(responseList, {
                key: CONFIG.keyMapped[textPayload]
            });
            service.sendMessage(CONFIG.keyMapped[textPayload], userObj, CONFIG, nextQuestion,textPayload);
            userObj.lastQuestionKey = CONFIG.keyMapped[textPayload];

            //ask for feedback after 5 seconds
            if (userObj.lastQuestionKey === "receipt") {
                setTimeout(function() {
                    _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped[userObj.lastQuestionKey], CONFIG.keyMapped[userObj.lastQuestionKey],textPayload);
                }, 5000);
            }

            //show default menu again
            else if (userObj.lastQuestionKey === "see_menu") {
                setTimeout(function() {
                    _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['select_menu'], 'select_menu',textPayload);
                }, 1000);
            }

            //notify user
            else if (userObj.lastQuestionKey === "receipt_order") {
                setTimeout(function() {
                    _this.sendNextQuestion(responseList, userObj, CONFIG.keyMapped['estimation'], 'estimation',textPayload);
                }, 1000);
            }

        }
    },
    //send next question to user as per questions mapping 
    sendNextQuestion: function(responseList, userObj, mappedkey, key,answer) {

        nextQuestion = _.findWhere(responseList, {
            key: mappedkey
        });
        service.sendMessage(key, userObj, CONFIG, nextQuestion,answer);
        userObj.lastQuestionKey = key;
    },
    //Get restaurent details including name and picture
    getRestaurantDetails: function(responseList, textPayload, restaurant) {
        var _key = restaurant,
            _restaurant = _.findWhere(responseList, {
                key: _key
            }),
            _restaurantObj = {};

        //get selected restaurant details
        _.find(_restaurant.options, function(item) {
            if (item.buttons[0].payload === textPayload) {
                _restaurantObj.title = item.title;
                _restaurantObj.image_url = item.image_url;
            }
        });

        return _restaurantObj;
    },
    //get selected meal details including name and picture 
    getMealDetails: function(responseList, textPayload) {
        var _key = 'select_meal',
            _restaurant = _.findWhere(responseList, {
                key: _key
            }),
            _mealObj = {};

        //Get selected meal details 
        _.find(_restaurant.options, function(item) {
            if (item.buttons[0].payload === textPayload) {
                _mealObj.title = item.title;
                _mealObj.image_url = item.image_url;
            }
        });

        return _mealObj;
    }
};