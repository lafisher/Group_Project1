$(document).ready(function() {

var test = 123;
console.log(test);

// firebase initialize
var config = {
    apiKey: "AIzaSyC8qOlu41DAJ_qJEKOhOQ95XcD9JRXWLbY",
    authDomain: "gp1-hookedonafeeling.firebaseapp.com",
    databaseURL: "https://gp1-hookedonafeeling.firebaseio.com",
    storageBucket: "gp1-hookedonafeeling.appspot.com",
    messagingSenderId: "236483189922"
};
firebase.initializeApp(config);

var database = firebae.database();

var loggedDate = "";		//<---variables for diary/tabel
var loggedMood = "";
var loggedVidLink = "";
var currentDateTime = moment(); //<--varibale for posting current date-time in various places on site



});