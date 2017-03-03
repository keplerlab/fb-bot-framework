var CONFIG = {
    //Facebook API token
    accessToken: "<Your Facebook Token>",

    //WIT NPL engine API token
    witToken: "<Your WIT Token>",

    port: 8080,
    ssl: {
        key: "",
        cert: "",
        ca: ""
    },

    isFirebaseDB : false,

    //Application token to verify with Facebook API
    verifyToken: "botdemo", //it can any string you want, but should match to facebook webhook token 

    listenPort: 443,

    //Set default messages 
    defaultAuthMsg: "User not authorized, kindly try again with different credentials.",
    defaultQueryMsg: "Will be glad to help you. Kindly write to us keplerlab@sapient.com",
    
    //firebase API token
    firebase : {
        apiKey: "<Your firebase api key>",
        authDomain: "<Domain name>",
        databaseURL: "<Database url>",
        storageBucket: "<Storage key>",
        messagingSenderId: "<Sender id>",
        serviceAccount : {

        } //Firebase private key
    },

    //chatbot key mapping (Mapping between user response and next questions to ask from end user) 
    keyMapped: {
        "welcome_greeting": "welcome_greeting",
        "select_menu": "select_menu",
        "see_menu": "see_menu",
        "make_reservation": "select_restaurant",
        "restaurant_1": "no_of_people",
        "restaurant_2": "no_of_people",
        "restaurant_3": "no_of_people",
        "no_of_people": "no_of_people",
        "day_and_time": "day_and_time",
        "reservation_length": "reservation_length",

        "30_min": "special_request",
        "60_min": "special_request",
        "90_min": "special_request",
        "general_dining": "confirmation",
        "romatic_dinner": "confirmation",
        "private_party": "confirmation",
        "confirm_reservation": "receipt",
        "cancel_reservation": "cancel_greeting",
        "receipt": "feedback",
        "one_star": "comments",

        "three_star": "comments",
        "five_star": "comments",
        "comments": "thanks_greeting",
        "order_takeout": "meal_options",
        "by_favourite": "select_restaurant_cousine",
        "by_cousine": "cousine_type",
        "pizza": "select_restaurant_cousine",
        "burger": "select_restaurant_cousine",
        "sub": "select_restaurant_cousine",
        "restaurant_cousine_1": "pre_order",
        
        "restaurant_cousine_2": "pre_order",
        "restaurant_cousine_3": "pre_order",
        "restaurant_cousine_4": "pre_order",
        "restaurant_cousine_5": "pre_order",
        "select_restaurant_cousine": "pre_order",
        "my_favourite_order": "select_meal",
        "my_custom_order": "select_meal",
        "meal_1": "other_items",
        "meal_2": "other_items",
        "meal_3": "other_items",
        "meal_4": "other_items",
        
        "meal_5": "other_items",
        "meal_6": "other_items",
        "drinks": "drinks",
        "fries": "fries",
        "no_thanks": "confirmation_order",
        "beer": "confirmation_order",
        "wine": "confirmation_order",
        "soft_drink": "confirmation_order",
        "thick_cut": "confirmation_order",
        "house_cut": "confirmation_order",
        "twice_fried": "confirmation_order",
        "confirm_order": "receipt_order",
        "cancel_order": "cancel_greeting",
        "estimation": "feedback",
    }
};
module.exports = CONFIG;