//lets require/import the mongodb native drivers.
var CONFIG = require('./bot-config');
var firebaseAdmin = require("firebase-admin");

//only if database is enabled 
if(CONFIG.isFirebaseDB){
	//Initialize firebase 
	firebaseAdmin.initializeApp({
	  credential: firebaseAdmin.credential.cert(CONFIG.firebase.serviceAccount),
	  databaseURL: CONFIG.firebase.databaseURL
	});
}

module.exports = {
  //load questions from firebase
  getQuestionsList : function(){
    var db = firebaseAdmin.database(), 
        questions = db.ref();

    return questions;
  },
  //save chat to database 
  saveChat : function (chatData) {
       
       //get new key from firebase
        var newPostKey = firebaseAdmin.database().ref().child('chatData').push().key;
        var newChat = {};
        newChat['/chatData/' + newPostKey] = chatData; //set data
        
        //update table
        firebaseAdmin.database().ref().update(newChat);
  }
};