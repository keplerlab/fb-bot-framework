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
  - [Template Manager](#template-manager)
  - [Database Helper](#database-helper)
  - [User Session](#user-session)
  - [Firebase](#firebase)
  - [WIT Default Intents](#wit-default-intents)
  - [Firebase Default Database](#firebase-default-database)
- [UnSubscribe Your Chatbot](#unsubscribe-your-chatbot)
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

- Inbuilt template manager as per facebook messenger platform 
- Configuration driven including database and NLP settings and different APIs
- Response handler, which handles all kinds of request i.e text,payload,attachment and geo-locations sent by Facebbok API
- Service layer to handle application logic and integration with chatbot service
- Node driven environment 
- JSON loader to accept content from dummy JSON file or database 
- Session handling (respond to multiple request at the same time)

## Installation

Kindly follow below steps thoroughly and install all mandatory softwares and node packages as dependencies.  

### Requirements

We need to download and install some quick software before dig & dive into source code  

* Create Facebook page - https://www.facebook.com/pages/create/
* Create Facebook developer account -	https://developers.facebook.com/quickstarts/?platform=web
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
You also need to setup a node server on your localhost, which is responsible to handle and respond all the client/user requests. This  server will act as a webhook or callback handler to Facebook API.  
* Download Node JS - https://nodejs.org/en/ and follow all steps to install node server on machine 
* Go to Github and download/clone messenger framework from github - https://github.com/keplerlab/fb-bot-framework 
* Go to synced/downloaded folder
* Open command prompt and run `npm install`, which installs all the project dependencies. 
* Now run the server as `npm start` or `node server`

#### Ngrok
You also need to setup a secure tunnel to your localhost server. Ngrok is a tool that allows you to easily expose your localhost server to the outside world. Make sure your firewall won’t block this.  
* Download ngrok - https://ngrok.com/download, extract your setup and go inside the folder 
* Open command prompt and run `ngrok http 8080`, this will create one random https tunnel for you and you don’t require any online hosting to test your application.
* Copy randomly generated https url to Facebook webhook page, once your app is ready (Later Step)
* As per below screen, it is : https://8efe40b4.ngrok.io/

#### WIT API 
Wit.ai makes it easy for developers to build applications and devices that you can talk or text to. It helps you to process natural languages.
* Go to WIT.AI  https://wit.ai/ 
* Create your developer account using Github or Facebook, else login 
* Click on      icon on top right panel, and enter your app name `botDemo`
* Click on `Import your app from a backup` before create app button (To save our time, we have dummy stories ready for Restaurant application)
* Go to Chatbot source code and select `restaurantbot-wit-dummy.zip` file. (This will import all dummy stories, entities and actions` required for restaurant Chatbot application.

#### Google Firebase
Firebase will be leverage as database for this chatbot. This database will save user chat history and questions that a bot will ask to end user.
* Go to Firebase https://firebase.google.com/ and create your account
* If you already have valid G-mail id, you can directly create your developer account on Firebase Console https://console.firebase.google.com 
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
* Go to https://console.firebase.google.com/  and select your application, Click on "Add Firebase to your web app"
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


### Server Configuration


### Server


### Response Handler


### Template Manager


### Database Helper


### User Session


### Firebase


### WIT Default Intents


### Firebase Default Database



## UnSubscribe Your Chatbot
To unsubscribe your page immediately, just go to the application page and unsubsribe your page under messenger tab and webhook section.   

## Known Issues

We don't find any issues as of now, but we'll be glab in case anyone find any issue and update us via email `IndiaStudio-Kepler@sapient.com`

## Reaching Out

Doing anything interesting with chatbot or want to share your favorite tips and tricks? 
Feel free to reach out with ideas for features or requests.

## Disclaimer

This project is not supported nor maintained by Facebook Messenger Platform.
