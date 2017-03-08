$("#addMoodButton").on("click", function(){
	event.preventDefault();
	var mood = "";
	giphy(mood);
	apiCall(mood);
});


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

//Giphy function 
function giphy(mood){
// var mood = "excited";
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
}
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

}


////////////////////////////////// Shawn's Code //////////////////////////////////

//used to call youtube API to grab video IDs based on playlist ID
function apiCall(playlistId) {

    var videoIdArray = []; //Array to hold each video ID
    var playlistId = 'PLhGO2bt0EkwvRUioaJMLxrMNhU44lRWg8'; //this value will be provided based on the emotion chosen
    var key = 'AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU'; //this is my personal google data API key
    var queryURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlistId + "&key=" + key;

    $.ajax({
        url: queryURL,
        query: 'GET'
    }).done(function(response) {
        console.log(response);
        //for loop to grab the 
        for (var i = 0; i < response.items.length; i++) {
            videoIdArray.push(response.items[i].snippet.resourceId.videoId);   
        }

        var randomNum = Math.floor(Math.random() * videoIdArray.length); //random number to grab a random video id from the array

        //call displayVideo function with a random video id
        displayVideo(videoIdArray[randomNum]);
        console.log(videoIdArray);

    });

}

//function to be called to display a random video from the array of playlist ids pulled from YouTube API
function displayVideo(vidId) {
    //iframe html element to hold youtube video
    var iframe = $('<iframe>');
    iframe.attr('id', 'youtube-frame');
    //URL to be used to display the specifc video
    url = 'https://www.youtube.com/embed/' + vidId;
    iframe.attr("src", url);
    $('#vidDiv').append(iframe);

    //640 width - 390 height for iframe element
}

//function to take mood variable to determine playlist to send to API
function generatePlaylistId(mood) {
    var playlistId;
    if (mood = 'excited') {
        playlistId = "";
    }

    apiCall(playlistId);
}

//response.items[i].snippet.resourceId.videoId  <- thatll give us the vidId for each of the 5 songs
// api reference to get playlistitems from playlistId:
// https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLhGO2bt0EkwvRUioaJMLxrMNhU44lRWg8&key=AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU
//drop down for mood - get the value of that field and had if statement determine playlist id based on mood