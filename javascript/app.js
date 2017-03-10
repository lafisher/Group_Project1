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

$('.dropdown-menu li a').on('click', function(){
    $('#currentMood').val($(this).text());
    console.log(($(this).text()));
    $('#currentMood').html("Today's Mood: " + ($(this).text()));
});

$("#addMoodButton").on("click", function(){
    event.preventDefault();

    var validDate = moment($('#date-input').val().trim(), 'MM/DD/YYYY',true).isValid();

    if (validDate) {
        $('.alert-danger').hide();
        var mood = $('#currentMood').val();
        console.log(mood);
        giphy(mood);
        displayVideo(mood);
    } else {
        $('.alert-danger').show()
        $('#date-input').val('');
    }
});

database.ref().on("child_added", function(childSnapShot){
    var tblRow = $('<tr>');
   
    tblRow.append('<td>' + childSnapShot.val().loggedDate + '</td>');
    tblRow.append('<td>' + childSnapShot.val().loggedMood + '</td>');
    tblRow.append('<td>' + childSnapShot.val().loggedVidLink + '</td>');
    
    $("#moodTable").append(tblRow);

}, function(errorObj){
    console.log("Error: " + errorObj.code);
});

// function to push data to firebase
function firebaseMood(mood, url){

    var loggedDate = "";		               
    var loggedMood = "";
    var loggedVidLink = "";

    loggedDate = $("#date-input").val().trim();
    loggedMood = mood;
    loggedVidLink = url;

    database.ref().push({
        loggedDate: loggedDate,
        loggedMood: loggedMood,
        loggedVidLink: loggedVidLink
    });

};

//Giphy function 
function giphy(mood){
var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + mood + "&api_key=dc6zaTOxFJmzC&limit=4";

$.ajax({                     
        url: queryURL,
        method: "GET"
    })
    .done(function(response) { 
        var results = response.data;
        console.log(response.data)
        // for (var i = 0; i < response.data.length; i++){
         var moodGif = $("<img>");
         moodGif.attr("src", results[0].images.original.url);
         moodGif.attr("width", "640");
         moodGif.attr("height", "390");
         $("#gifDiv").html(moodGif);   
        // };
    });
}
////////////////////////////////// Shawn's Code //////////////////////////////////

//used to call youtube API to grab video IDs based on playlist ID and display on page
function displayVideo(mood, playlistId) {

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
        videoId = videoIdArray[randomNum];
        console.log(videoIdArray);

        //iframe html element to hold youtube video
        var iframe = $('<iframe>');
        iframe.attr('id', 'youtube-frame');
        //URL to be used to display the specifc video
        var url = 'https://www.youtube.com/embed/' + videoId;
        iframe.attr("src", url);
        $('#vidDiv').html(iframe);

        firebaseMood(mood, url);

    });
}

//function to be called to display a random video from the array of playlist ids pulled from YouTube API
// function displayVideo(mood, vidId) {
//     //iframe html element to hold youtube video
//     var iframe = $('<iframe>');
//     iframe.attr('id', 'youtube-frame');
//     //URL to be used to display the specifc video
//     var url = 'https://www.youtube.com/embed/' + vidId;
//     iframe.attr("src", url);
//     $('#vidDiv').html(iframe);
//     firebaseMood(mood, url);
// }

//function to take mood variable to determine playlist to send to API
function generatePlaylistId(mood) {
    var playlistId;
    if (mood == 'happy') {
        playlistId = '';
    } else if (mood =='sad') {
        playlistId = '';
    } else if (mood == 'mad') {
        playlistId = '';
    } else if (mood == 'excited') {
        playlistId = '';
    } else {
        playlistId = '';
    }

    apiCall(playlistId);
}

//response.items[i].snippet.resourceId.videoId  <- thatll give us the vidId for each of the 5 songs
// api reference to get playlistitems from playlistId:
// https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLhGO2bt0EkwvRUioaJMLxrMNhU44lRWg8&key=AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU
//drop down for mood - get the value of that field and had if statement determine playlist id based on mood