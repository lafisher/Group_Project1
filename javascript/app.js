$(document).ready(function() {

    // firebase initialize for table database
    var config = {
        apiKey: "AIzaSyC8qOlu41DAJ_qJEKOhOQ95XcD9JRXWLbY",
        authDomain: "gp1-hookedonafeeling.firebaseapp.com",
        databaseURL: "https://gp1-hookedonafeeling.firebaseio.com",
        storageBucket: "gp1-hookedonafeeling.appspot.com",
        messagingSenderId: "236483189922"
    };

    firebase.initializeApp(config);

    //check if there is a current user to show or hide modal
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#login-modal').modal('hide');
            tableBuild();
        } else {
            $('#login-modal').modal({
                backdrop: 'static'
            });
            $('#login-modal').modal('show');
        }
    });
    
    // click event for user loging, uses google accout stores user accout id in userId variable for later use
    $('#login').on('click', function(){
        event.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    });

    // mood dropdown menu control
    $('.dropdown-menu li a').on('click', function(){
        $('#currentMood').val($(this).text());
        $('#currentMood').html("Current Mood: " + ($(this).text()));
        $('#date-input').show();
        $('#gifDiv').html('');
        $('#vidDiv').html('');

    });

    // on click verifies correct date format is used and mood/data/commets are added to firebase
    $("#addMoodButton").on("click", function(){
        event.preventDefault();

        var validDate = moment($('#date-input').val().trim(), 'MM/DD/YYYY',true).isValid();

        if (validDate) {
            $('.alert-danger').hide();
            var mood = $('#currentMood').val();
            giphy(mood);
            displayVideo(mood);      
        } else {
            $('.alert-danger').show();
            $('#date-input').val('');
        }
    });

    // Leigh's code for css change //

    //happy
    $("#happy").click(function(){
        var backGround = "images/newjoy.jpg";
        $(".jumbotron").css("background-color", "#2e5bce");
        $("#currentMood").css("background-color", "#f8f7be");
        $("#addMoodButton").css("background-color", "#f8f7be");
        $(".panel-heading").css("background-color", "#f8f7be");
        $(".main-container").css("background-image", 'url("' + backGround + '")');

    });

    //sad
    $("#sad").click(function(){
        var backGround = "images/newsadness.jpg";
        $(".jumbotron").css("background-color", "#044f67");
        $("#currentMood").css("background-color", "#37bc9b");
        $("#addMoodButton").css("background-color", "#37bc9b");
        $(".panel-heading").css("background-color", "#37bc9b");
        $(".main-container").css("background-image", 'url("' + backGround + '")');
    });

    //mad
    $("#mad").click(function(){
        var backGround = "images/newanger.jpg";
        $(".jumbotron").css("background-color", "#800a0a"); 
        $("#currentMood").css("background-color", "#d93013");
        $("#addMoodButton").css("background-color", "#d93013");
        $(".panel-heading").css("background-color", "#d93013");
        $(".main-container").css("background-image", 'url("' + backGround + '")');
    });

    //excited
    $("#excited").click(function(){
        var backGround = "images/newfear.jpg";
        $(".jumbotron").css("background-color", "#471228");
        $("#currentMood").css("background-color", "#8c6aaa");
        $("#addMoodButton").css("background-color", "#8c6aaa");
        $(".panel-heading").css("background-color", "#8c6aaa");
        $(".main-container").css("background-image", 'url("' + backGround + '")');
    });

    //tired
    $("#tired").click(function(){
        var backGround = "images/newdisgust.jpg";
        $(".jumbotron").css("background-color", "#034002");
        $("#currentMood").css("background-color", "#A0D468");
        $("#addMoodButton").css("background-color", "#A0D468");
        $(".panel-heading").css("background-color", "#A0D468");
        $(".main-container").css("background-image", 'url("' + backGround + '")');
    });

    //end leigh's code

    function tableBuild(){
        var database = firebase.database();
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + userId).on("child_added", function(childSnapShot){
            var tblRow = $('<tr>');
            var urlLoggedVidLink = $("<href>");
            urlLoggedVidLink.attr("href", childSnapShot.val().loggedVidLink);
            tblRow.append('<td>' + childSnapShot.val().loggedDate + '</td>');
            tblRow.append('<td>' + childSnapShot.val().loggedMood + '</td>');
            tblRow.append('<td>' + "<a href=" + childSnapShot.val().loggedVidLink + ">YouTube Link</a></td>");
            tblRow.append('<td>' + childSnapShot.val().loggedComment + '</td>');
            $("#moodTable").append(tblRow);
            $('#date-input').val('');
            $('#journal').val(''); 
            $('#currentMood').html('Choose Mood <span class="caret"></span>'); 
        }, function(errorObj){
            console.log("Error: " + errorObj.code);
        });
    }//END tableBuild

    // function to push data to firebase
    function firebaseMood(mood, url, userId, database){

        var userId = firebase.auth().currentUser.uid;
        var loggedDate = "";                       
        var loggedMood = "";
        var loggedVidLink = "";
        var loggedComment = "";

        loggedDate = $("#date-input").val().trim();
        loggedMood = mood;
        loggedVidLink = url;
        loggedComment = $("#journal").val().trim();

        firebase.database().ref('user/' + userId).push({
            loggedDate: loggedDate,
            loggedMood: loggedMood,
            loggedVidLink: loggedVidLink,
            loggedComment: loggedComment
        });
    }//END firebaseMood

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
    }//END giphy

    // used to call youtube API to grab video IDs based on playlist ID and display on page
    function displayVideo(mood) {

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
            playlistId = 'PL8vILzn50tszZpEYl8AIViHC205ECVCM1'; //tired playlist on leighs youtube channel
        }

        var videoIdArray = []; //Array to hold each video ID
        var key = 'AIzaSyDsKfYqK9sqfPetOx2uir2V2UhxYVqivMU'; //this is my personal google data API key
        var queryURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlistId + "&key=" + key;

        $.ajax({
            url: queryURL,
            query: 'GET'
        }).done(function(response) {
            for (var i = 0; i < response.items.length; i++) {
                videoIdArray.push(response.items[i].snippet.resourceId.videoId);   
            }

            var randomNum = Math.floor(Math.random() * videoIdArray.length); //random number to grab a random video id from the array

            //call displayVideo function with a random video id
            videoId = videoIdArray[randomNum];

            //iframe html element to hold youtube video
            var iframe = $('<iframe>');
            iframe.attr('id', 'youtube-frame');

            //URL to be used to display the specifc video
            var url = 'https://www.youtube.com/embed/' + videoId;
            iframe.attr("src", url);
            $('#vidDiv').html(iframe);

             firebaseMood(mood, url);
        });
    }//END displayVideo

}); //END of .ready()
