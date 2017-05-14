# fb-bot-framework

`fb-bot-framework` is a quick chatbot framework for `Facebook Messenger Platform`. This framework allows you to quickly setup your chatbot on your local machine with minimal configuration and quick installation. 

`fb-bot-framework` is originally developed by `Kepler team` and leverage it for many client POC and chatbot projects. The intent was to create a `chatbot framework` on top of facebook messenger platform and support easy and quick integration of database like `Firebase` and `NPL engines` like `WIT`.  

## Table of Contents
- [Prerequisite](#prerequisite)
- [Features](#features)
- [Installation](#installation)
  - [Requirements](#requirements)
    - [Facebook Page](#facebook-page)
    - [Facebook App](#facebook-app)
    - [Node Server](#node-server)
    - [Ngrok](#ngrok)
    - [WIT API](#wit-api)
    - [Firebase Database](#google-firebase)
  - [Platform Packages](#platform-packages)
- [Setup](#setup)
  - [Generate Application Token](#generate-application-token)
  - [Setup Webhook](#setup-webhook)
  - [Configure WIT Token](#configure-wit-token)
  - [Configure Firebase](#configure-firebase)
- [Testing](#testing)
- [Source Code Overview](#source-code-overview)
  - [Package JSON File](#package-json-file)
  - [Server Configuration](#server-configuration)
  - [Server](#server)
  - [Response Handler](#response-handler)
    - [Handle Auto Replies](#handle-auto-replies)
    - [Handle Message Type](#handle-message-type)
    - [Handle Application Flow](#handle-application-flow)
  - [Template Manager](#template-manager)
  - [Database Helper](#database-helper)
    - [Read data from Firebase](#read-data-from-firebase)
    - [Update data to Firebase](#update-data-to-firebase)
  - [User Session](#user-session)
  - [WIT Default Intents](#wit-default-intents)
  - [Firebase Default Database](#firebase-default-database)
- [Unsubscribe Your Chatbot](#unsubscribe-your-chatbot)
- [Known Issues](#known-issues)
- [Reaching Out](#reaching-out)
- [Disclaimer](#disclaimer)

## Prerequisite 

* Facebook Page
* Facebook Application ID
* Node server should pre-installed globally on your computer 
* WIT account API
* Firebase account API

## Features

- Inbuilt template manager as per Facebook messenger platform 
- Configuration driven including database and NLP settings and different APIs
- Response handler, which handles all kinds of request i.e text, payload, attachment and geo-locations sent by Facebook API
- Service layer to handle application logic and integration with chatbot service
- Node driven environment 
- JSON loader to accept content from dummy JSON file or database 
- Session handling (respond to multiple request at the same time)

## Installation

Kindly follow below steps thoroughly and install all mandatory softwares and node packages as dependencies.  

### Requirements

We need to download and install some quick software before dig & dive into source code  

* Create Facebook page - https://www.facebook.com/pages/create/
* Create Facebook developer account -   https://developers.facebook.com/quickstarts/?platform=web
* Node Server installed - https://nodejs.org/en/download/
* Ngrok server installed - https://ngrok.com/download
* Create WIT account - https://wit.ai/
* Create Firebase account - https://firebase.google.com/

#### Facebook Page
A facebook page provides you a platform where you can advertise and promote product. It also provide you one button which helps you to connect to your end users.  

* Go to https://www.facebook.com/pages/create/
* Click on Brand and Product
* Select any page category
* Choose any sub category 
* Enter page name `botDemo` 

#### Facebook App
In facebook terminology we have just setup facebook SDK, which can be used for multi purposes. In our case we are going to leverage it for chatbot with web.  
* Go to https://developers.facebook.com/quickstarts/?platform=web or click on Register button and register for app
* Enter application name `botDemo` and click on `Create New Facebook App ID` button
* Choose display name, email and category `Apps for Messenger`
* Pass your captcha information, if system ask 

#### Node Server
You also need to setup a node server on your localhost, which is responsible to handle and respond all the client/user requests. This server will act as a webhook or callback handler to Facebook API.  
* Download Node JS - https://nodejs.org/en/ and follow all steps to install node server on machine 
* Go to Github and download/clone messenger framework from github - https://github.com/keplerlab/fb-bot-framework 
* Go to synced/downloaded folder
* Open command prompt and run `npm install`, which installs all the project dependencies. 
* Now run the server as `npm start` or `node server`

#### Ngrok
You also need to setup a secure tunnel to your localhost server. Ngrok is a tool that allows you to easily expose your localhost server to the outside world. Make sure your firewall won’t block this.  
* Download ngrok - https://ngrok.com/download, extract your setup and go inside the folder 
* Open command prompt and run `ngrok http 8080`, this will create one random https tunnel for you and you don’t require any online hosting to test your application.
* Copy randomly generated https URL to Facebook webhook page, once your app is ready (Later Step)
* As per below screen, it is https://8efe40b4.ngrok.io/

#### WIT API 
Wit.ai makes it easy for developers to build applications and devices that you can talk or text to. It helps you to process natural languages.
* Go to WIT.AI https://wit.ai/ 
* Create your developer account using Github or Facebook, else login 
* Click on      icon on top right panel, and enter your app name `botDemo`
* Click on `Import your app from a backup` before create app button (To save our time, we have dummy stories ready for Restaurant application)
* Go to Chatbot source code and select `restaurantbot-wit-dummy.zip` file. (This will import all dummy stories, entities and actions` required for restaurant Chatbot application.

#### Google Firebase
Firebase will be leverage as database for this chatbot. This database will save user chat history and questions that a bot will ask to end user.
* Go to Firebase https://firebase.google.com/ and create your account
* If you already have valid G-mail id, you can directly create your developer account on Firebase Console https://console.firebase.google.com 
* Click on `Create new project` and enter your `Database name` and select Country

### Platform Packages

We must need below node platform packages 
```shell
  "dependencies": {
    "body-parser": "^1.15.1",
    "express": "^4.13.4",
    "firebase": "^3.6.10",
    "firebase-admin": "^4.1.1",
    "fs": "0.0.2",
    "http": "0.0.0",
    "https": "^1.0.0",
    "jsonfile": "^2.3.1",
    "node-wit": "1.0.0",
    "promise": "^7.1.1",
    "request": "^2.72.0",
    "serve-static": "^1.10.2",
    "underscore": "latest",
    "wit-js": "0.0.1"
  }
```

## Setup

### Generate Application Token
* Go to https://developers.facebook.com/apps/ and Select your application
Messenger 
* Look for messenger tab in left panel and click  
* Go to Token generation section and select your application 
* Select your page, allow access to your page and you will get a new token
* Copy this token to `bot-config.js` file, available in source code root folder Webhooks 
* Click on `Add Product` button and get started `Webhooks` 

### Setup Webhook
* Go to https://developers.facebook.com/quickstarts/?platform=web or webhook section in left panel
* Click on `New subscription` button and select `page` from drop-down list.
* Go to ngrok and copy dynamically created https url like `https://<your ngrok url>/webhook` (Note : followed by `/webhook` string)
* Go to source code and copy `verifyToken` value from there and paste it in to popup, which is asking for verify token
* Select `messaging` and `messaging_postback` options from the list, Click on `verify and save` button
* Now, go to Messenger tab and look for webhooks. Select your page from dropdown and click on `Register` button    

### Configure WIT Token
* Go to https://wit.ai/ 
* Select your application and click on `Settings` tab on top right panel
* Look for API details section 
* Copy your server action token, as selected below
* Paste it to your source code configuration file, named as `bot-config.js` with key name `witToken`.

### Configure Firebase
* Go to https://console.firebase.google.com/ and select your application, Click on "Add Firebase to your web app"
* Copy your config properties object and paste in to framework config file, name as `bot-config.js` file
* Now, click on settings icon on the left and select "project settings"
* Select "Service accounts" tab, Click on "Generate new private key" 
* Copy main object from download key file and replace with "Firebase->serviceAccount" object exist in framework `bot-config.js` file
* Firebase will be leverage as database for this chatbot. This database will save user chat history and questions that a bot will ask to end user.

## Testing 
* Go to Facebook page or messenger - https://www.messenger.com/
* Copy your page id and search in messenger chat window
* Or you can Click on your Facebook page `message` button and start your conversation, but as a third person. 

## Source Code Overview

### Package JSON File

Package JSON file is used to define all the required dependancies and dev-dependancies, if any. Make sure that all these modules should be available before running your node server.  

```shell
{
  "name": "botdemo",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "dependencies": {
    "body-parser": "^1.15.1",
    "express": "^4.13.4",
    "firebase": "^3.6.10",
    "firebase-admin": "^4.1.1",
    "fs": "0.0.2",
    "http": "0.0.0",
    "https": "^1.0.0",
    "jsonfile": "^2.3.1",
    "node-wit": "1.0.0",
    "promise": "^7.1.1",
    "request": "^2.72.0",
    "serve-static": "^1.10.2",
    "underscore": "latest",
    "wit-js": "0.0.1"
  },
  "devDependencies": {},
  "scripts": {
    "start": "node server.js"
  },
  "author": "",
  "license": "ISC"
}
```
### Server Configuration

The configuration file contains all the api keys and access tokens including `WIT`, `Facebook`, `Firebase` and other services. You need to set following key items in your configuration file. 

```shell
{    
    accessToken: "<Your Facebook Token>", //Get your token from facebook app page

    witToken: "<Your WIT Token>", //get your token from WIT API

    port: 8080, //Set port for ngrok tunnel 

    ssl: { //This need to be enabled for production use 
        key: "",
        cert: "",
        ca: ""
    },

    isFirebaseDB : false, //Default value is set to false (No data will be save to Firebase, till the value is true) 

    verifyToken: "botdemo", //it can any string you want, but should match to facebook webhook token 

    listenPort: 443, //set your node server port 

    //Set default messages 
    defaultAuthMsg: "User not authorized, kindly try again with different credentials.",
    defaultQueryMsg: "Will be glad to help you. Kindly write to us keplerlab@sapient.com",
    
    //firebase API token, get it from Firebase application 
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
        "make_reservation": "select_restaurant",
        "select_restaurant": "no_of_people",
        "no_of_people": "day_and_time",
        "day_and_time": "reservation_length",
    }
}
```  

### Server

`server.js` file is the main file, which runs immediately whenever you execute `npm start` or `node server` or `node server.js` Below are the responsibilities of this node server. 

* Loads all the node server project dependencies 
* Pre-load all set of trained questions from JSON file or real-time database (Firebase), depends on your framework configurations
* Responsible to handle all user requests received through Facebook `webhooks`
* Get user profile information from `Facebook` API if user is new to chatbot 
* Create node server instance on specified system port as configured by developer.

### Response Handler
Response handler is a helper file, which handles most important work flow of the application framework. Below are the roles and responsibilities of this helper file.  

#### Handle Auto Replies

`autoReply` function is responsible to prepare quick auto reply template with upcoming question. It takes three patameters `text` as message which received, `userObj` as user session object and `responseList` as an array of pre-trained question list to ask.  

```shell
  autoReply: function(text, userObj, responseList) {
    ...
  }
```

#### Handle Message Type

There are many types of messages `Facebook API` provides, which includes response type such as `messages` and `messages_postback`. 

* `Messages`: Messages are normal text messages respond by Facebook API
* `Messages Postback`: These are postback messages. When you provide option list to end user, for ex: your chatbot asked end user to select any of the option from the list. Here `postback_1` and `postback_2` will receive as message to your server.

```shell
[{
    "type": "postback",
    "title": "Option 1",
    "payload": "option_1"
},{
    "type": "postback",
    "title": "Option 2",
    "payload": "option_2"
}]
````    

#### Handle Application Flow

This handler also takes care of preparing next question for user upon response from previous question. And fetch restaurant and meal details from user session object. Below function requires these parameters to decide next operation of application flow
* `responseList` - List of pre-trained data or questions
* `userObj` - User session object
* `mappedkey` - Key of next questions to ask 
* `key` - Current question key   
* `answer` - Answer to be provided    

```shell
    sendNextQuestion: function(responseList, userObj, mappedkey, key,answer) {
      ...
    }
```

### Template Manager

Template manager is responsible to handle all kinds of `Facebook Messanger Platform` driven templates. Many of these templates are already covered in template manager. Have a look at the list below. Other new templates will integrate over time.      

* Normal text template - Ex :- (Hi)
* Option list template - Ex :- (Colors: ["Option 1", "Option 2"])
* Receipt template - Ex: - (You order has been confirmed details including any picture and other highligted text)
* Generic template
* Caraousel template - Ex :- (Burgers: [{name:"Pizza burger",image:'pizza.jpg'},{name:"Cheese burger",image:'cheese.jpg'}])
* Quick reply template - Ex :- (Colors: ["Red", "Green","Blue"])

All you have to call the right template and send the right data in right format. Here is preview of template manager file:

```shell
{
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
    }
}
```

Here is an example to call your specific template with below data:

```shell
let data = [{id : 1,name:"Pizza burger",image:'pizza.jpg'},{id : 2,name:"Cheese burger",image:'cheese.jpg'}]
getTmplOptionList(data);
``` 

### Database Helper
Database helper is responsible to create a connection to Firebase. It also fetches all the initial pre-trained data list and save user chat history to realtime Firebase database. This helper always look for `isFirebaseDB` key in configuration file, which decide whether the data needs to be save or not. 

#### Read data from Firebase 

This is how we fetch the data from firebase database. First create an intance from super class and then create a reference to the table. 

```shell
    var db = firebaseAdmin.database(); //Initialize database object 
    var data = db.ref(); //get database reference 
    console.log(data);
```

#### Update data to Firebase

This is how we first look for the object key which we want to update, if this object key doesn't exist then it's get added to list. `.update()` method will update the table or selected object key data, whatever data you have passed to it.    

```shell 
    var newPostKey = firebaseAdmin.database().ref().child('chatData').push().key; //get children object from table
    var newChat = {};

    newChat['/chatData/' + newPostKey] = chatData; //set data
    firebaseAdmin.database().ref().update(newChat); //update table
```

### User Session

User session object is designed to manage user session and retain user action history for post processing. A server can have list of active user sessions.   

```shell
    function User(userId, profile) {
        this.userId = userId; //user if provided by Facebook
        this.status = false;
        this.profile = profile; //store user first name, profile image and other personal information requested by you 
        this.lastQuestion = {}; //last question that system had asked 
        this.chatData = {}, //save user chat history 
        this.lastQuestionKey = ''; //store key of last selected question
        this.selectedRestaurantName = ''; //store last selected restaurant name by user   
        this.selectedRestaurantImage = ''; //store last selected restaurant image by user
        this.selectedDay = ''; //store last selected day to visit restaurant by user
    }
```

### WIT Default Intents

This framework have a default NLP engine data, in our case its `WIT` data. Which contains all the `entities`, which further contains `intents`, `actions`,`expressions` and their `stories`. For ex:- 

```shell
Story - Intent
What is Sapient? - sapient
SapientNitro - sapient 
Sapient Razorfish - sapient 
```

Note: Every NLP engine have their own algorithm or ways to train their system. In case of `WIT`, they rely on story based mechanism. For more information checkout https://wit.ai/       

### Firebase Default Database

This framework provides one dummy JSON object, which can be used to quickly import it to your Firebase database. This object contains mainly two mandatory objects.

* `questions` - List of set of questions to ask from end user.  
* `chatData` - User chat history to save to database. 

```shell
{
    "questions": [{
        "response": "Hi <user>, I am Restaurant Bot. How can I help you today?",
        "key": "welcome_greeting",
        "tType": "text",
        "options": []
    }, {
        "response": "Please select an option to start with.",
        "key": "select_menu",
        "tType": "optionList",
        "options": [{
            "id": "see_menu",
            "name": "See Menu"
        }, {
            "id": "make_reservation",
            "name": "Make a Reservation"
        }, {
            "id": "order_takeout",
            "name": "Order Takeout"
        }]
    }],
    "chatData": []
}
```

## Unsubscribe Your Chatbot
To unsubscribe your page immediately, just go to the application page and unsubsribe your page under messenger tab and webhook section.   

## Known Issues

We don't find any issues as of now, but we'll be glad in case anyone find any issue and update us via email `IndiaStudio-Kepler@sapient.com`

## Reaching Out

Doing anything interesting with chatbot or want to share your favorite tips and tricks? 
Feel free to reach out with ideas for features or requests.

## Disclaimer

This project is not supported nor maintained by Facebook Messenger Platform.
