//Load external references 
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');

//Load internal references
var CONFIG = require('./bot-config');
var service = require('./bot-service');
var responseHandler = require('./bot-response-handler');
var User = require('./bot-user-class');
var _ = require('underscore');
var questionsList = [];
var activeUsers = [];
var app = express();
var Promise = require('promise');

//update SSL certificate 
function setSSL(fs) {
    CONFIG.ssl = {
        key: fs.readFileSync('/privkey.pem'),
        cert: fs.readFileSync('/cert.pem'),
        ca: fs.readFileSync('/chain.pem')
    }
}

//load questions
var getQuestionsList =   function(isFirebaseDB) {     
    var data = service.getQuestions(isFirebaseDB);

	if(CONFIG.isFirebaseDB){
		data.once("value").then(function(snapshot) { 
			questionsList = snapshot.val().questions;
		});
	}else{
		questionsList = data.questions;
	}
};

//get questions from database or load locally 
getQuestionsList(CONFIG.isFirebaseDB);

//Set request methods
app.use(bodyParser.urlencoded({
    extended: false
}));

// Process application/json
app.use(bodyParser.json());

//Respond to default request 
app.get('/', function(req, res) {
    res.send('Hello, This is Restaurant chatbot');
});

//Get platform callback and validate token   
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === CONFIG.verifyToken) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

//Handle post platform callback 
app.post('/webhook/', function(req, res) {


    //get events    
    messaging_events = req.body.entry[0].messaging;

    //iterate events 
    for (i = 0; i < messaging_events.length; i++) {

        event = req.body.entry[0].messaging[i]; //find event 
        userId = event.sender.id; //get sender id

        //Check if user pings and no acknowlegement event fires
        if (event.message || event.postback) {

            var userObj = _.findWhere(activeUsers, {
                userId: userId.toString()
            });

            //Get user profile if not exist
            if (typeof(userObj) !== "object") {

                request({
                    url: 'https://graph.facebook.com/v2.6/' + userId,
                    qs: {
                        access_token: CONFIG.accessToken
                    },
                    method: 'GET',
                    json: {
                        fields: "first_name,last_name,profile_pic,locale,timezone,gender"
                    }
                }, function(error, userData, body) {

                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (userData.body.error) {
                        console.log('Error: ', userData.body.error)
                    } else {
                        var userObj = new User(userId, userData.body); //Set user object
                        activeUsers.push(_.clone(userObj)); //add user

                        //send response
                        responseHandler.handleRequest(event, userObj, questionsList);
                    }
                });

            } else {

                //send response
                responseHandler.handleRequest(event, userObj, questionsList);
            }
        }

    }
    res.sendStatus(200);
});

// Create an HTTP service.
http.createServer(app).listen(CONFIG.port);

// setSSL(fs); //load SSL certificate 

// Create an HTTPS service identical to the HTTP service.
//https.createServer(ssl, app).listen(CONFIG.listenPort);