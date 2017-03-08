// firebase initialize for table database
var config = {
    apiKey: "AIzaSyC8qOlu41DAJ_qJEKOhOQ95XcD9JRXWLbY",
    authDomain: "gp1-hookedonafeeling.firebaseapp.com",
    databaseURL: "https://gp1-hookedonafeeling.firebaseio.com",
    storageBucket: "gp1-hookedonafeeling.appspot.com",
    messagingSenderId: "236483189922"
};

firebase.initializeApp(config);

var database = firebase.database();

var loggedDate = "";		//<---variables for diary/tabel
var loggedMood = "";
var loggedVidLink = "";
var currentDateTime = moment(); //<--varibale for posting current date-time in various places on site
console.log(moment(currentDateTime).format("MM/DD/YYYY"));



//Giphy ajax call for mood
var mood = "excited";
var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + mood + "&api_key=dc6zaTOxFJmzC&limit=1";

$.ajax({                     
        url: queryURL,
        method: "GET"
    })
    .done(function(response) { 
        var results = response.data;
        console.log(response.data)
		var moodGif = $("<img>");
		moodGif.attr("src", results[0].images.fixed_height.url);
		$("#gifDiv").append(moodGif);


});