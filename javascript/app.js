// firebase initialize for table database
var config = {
        apiKey: "AIzaSyC8qOlu41DAJ_qJEKOhOQ95XcD9JRXWLbY",
        authDomain: "gp1-hookedonafeeling.firebaseapp.com",
        databaseURL: "https://gp1-hookedonafeeling.firebaseio.com",
        storageBucket: "gp1-hookedonafeeling.appspot.com",
        messagingSenderId: "236483189922"
    };

firebase.initializeApp(config);
//     firebase.auth().getRedirectResult().then(function(result) {
//         if (result.credential) {
//            // This gives you a Google Access Token. You can use it to access the Google API.
//            var token = result.credential.accessToken;
//            // ...
//          }
//          // The signed-in user info.
//          var user = result.user;
//         }).catch(function(error) {
//          // Handle Errors here.
//          var errorCode = error.code;
//          var errorMessage = error.message;
//          // The email of the user's account used.
//          var email = error.email;
//          // The firebase.auth.AuthCredential type that was used.
//          var credential = error.credential;
//          // ...
//     });

// function userLogin(){
//    var provider = new firebase.auth.GoogleAuthProvider();
//    firebase.auth().signInWithRedirect(provider);
// };

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
    var urlLoggedVidLink = $("<href>");
    urlLoggedVidLink.attr("href", childSnapShot.val().loggedVidLink);
    console.log(urlLoggedVidLink);
    tblRow.append('<td>' + childSnapShot.val().loggedDate + '</td>');
    tblRow.append('<td>' + childSnapShot.val().loggedMood + '</td>');
    tblRow.append('<td>' + "<a href=" + childSnapShot.val().loggedVidLink + ">YouTube Link</a></td>");
    // tblRow.append('<td>' + childSnapShot.val().loggedComment + '</td>');

    // database.ref('users/' + userId).on("child_added", function(childSnapShot) {
    //     var tblRow = $('<tr>');
    //     var urlLoggedVidLink = $("<href>");
    //     urlLoggedVidLink.attr("href", childSnapShot.val().loggedVidLink);
    //     console.log(urlLoggedVidLink);
    //     tblRow.append('<td>' + childSnapShot.val().loggedDate + '</td>');
    //     tblRow.append('<td>' + childSnapShot.val().loggedMood + '</td>');
    //     tblRow.append('<td>' + "<a href=" + childSnapShot.val().loggedVidLink + ">YouTube Link</a></td>");
    //     tblRow.append('<td>' + childSnapShot.val().loggedComment + '</td>');
    // });
    
    $("#moodTable").append(tblRow);

}, function(errorObj){
    console.log("Error: " + errorObj.code);
});

// function to push data to firebase
function firebaseMood(mood, url){

    var loggedDate = "";		               
    var loggedMood = "";
    var loggedVidLink = "";
    // var loggedComment = "";

    loggedDate = $("#date-input").val().trim();
    loggedMood = mood;
    loggedVidLink = url;
    // loggedComment = $("#comment-input").val().trim();

    database.ref().push({
        loggedDate: loggedDate,
        loggedMood: loggedMood,
        loggedVidLink: loggedVidLink
        // loggedComment: loggedComment
    });

    // database.ref('users/' + userId).push({
    //     loggedDate: loggedDate,
    //     loggedMood: loggedMood,
    //     loggedVidLink: loggedVidLink
    //     loggedComment: loggedComment
    // });

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
        var moodGif = $("<img>");
        moodGif.attr("src", results[0].images.original.url);
        moodGif.attr("id", "gif-img");
        $("#gifDiv").html(moodGif);   
    });
}
////////////////////////////////// Shawn's Code //////////////////////////////////

//used to call youtube API to grab video IDs based on playlist ID and display on page
function displayVideo(mood) {

    console.log(mood);
    var playlistId;

    if (mood == 'Happy') {
        playlistId = 'PL8vILzn50tsyECzBFC5UFYDnnX07TA7wX'; //happy playlist on leighs youtube channel
    } else if (mood =='Sad') {
        playlistId = 'PL8vILzn50tsyKw_P4pRtT51tokZ0OFzAL'; //sad playlist on leighs youtube channel
    } else if (mood == 'Mad') {
        playlistId = 'PL8vILzn50tswztzIGsgMXTeCCc0n9_qIY'; //anger playlist on leighs youtube channel
    } else if (mood == 'Excited') {
        playlistId = 'PL8vILzn50tsyWmK0-QlqBk9t3WaLbTLlN'; //excited playlist on leighs youtube channel
    } else {
        playlistId = 'PL8vILzn50tszZpEYl8AIViHC205ECVCM1'; //tried playlist on leighs youtube channel
    }

    var videoIdArray = []; //Array to hold each video ID
    var key = 'AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU'; //this is my personal google data API key
    var queryURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlistId + "&key=" + key;

    $.ajax({
        url: queryURL,
        query: 'GET'
    }).done(function(response) {
        console.log(response);
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
// function generatePlaylistId(mood) {
//     var playlistId;
//     if (mood == 'happy') {
//         playlistId = '';
//     } else if (mood =='sad') {
//         playlistId = '';
//     } else if (mood == 'mad') {
//         playlistId = '';
//     } else if (mood == 'excited') {
//         playlistId = '';
//     } else {
//         playlistId = '';
//     }

//     apiCall(playlistId);
// }

//response.items[i].snippet.resourceId.videoId  <- thatll give us the vidId for each of the 5 songs
// api reference to get playlistitems from playlistId:
// https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLhGO2bt0EkwvRUioaJMLxrMNhU44lRWg8&key=AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU
//drop down for mood - get the value of that field and had if statement determine playlist id based on mood