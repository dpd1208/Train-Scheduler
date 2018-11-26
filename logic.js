$(document).ready(function () {
  new Date($.now());
  console.log(Date);
  moment().format("MMMM Do YYYY, h:mm:ss a");
  $("#time").append(Date);
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAlpmrAoNT7F4ScJLdcx3S7BKeYcsRyuME",
    authDomain: "train-scheduler-86895.firebaseapp.com",
    databaseURL: "https://train-scheduler-86895.firebaseio.com",
    projectId: "train-scheduler-86895",
    storageBucket: "train-scheduler-86895.appspot.com",
    messagingSenderId: "915253055226"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // button to submit the user given info
  $("#submit").on("click", function (event) {
    event.preventDefault();

    //set user input values to variables
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();

    //converts user input to usable info
    var firstTime = moment($("#first-train").val().trim(), "hh:mm").format('hh:mm a');
    var frequency = $("#frequency").val().trim();

    //gathers together all our new train info
    var newTrain = {

      train: trainName,
      departingTo: destination,
      arrivalTime: firstTime,
      occurence: frequency
    };


    //uploads newTrain to firebase
    database.ref().push(newTrain);
    //*push* adds to info already in firebase. *set* overwrites preexisting info

    //clears elements before adding new text
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
  }); //end of onclick


  database.ref().on("child_added", function (childSnapshot) {

    console.log(childSnapshot.val());
    //store in variables
    var trainName = childSnapshot.val().train;
    var destination = childSnapshot.val().departingTo;
    var firstTime = childSnapshot.val().arrivalTime;
    var frequency = childSnapshot.val().occurence;

//current time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    //makes first train time neater
    var trainTime = moment.unix(firstTime).format("HHmm");
    console.log(trainTime);

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    //calculate difference between times
    var difference = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(difference);
    //time apart(remainder)
    var trainRemaining = difference % frequency;

    //minutes until arrival
    var minutesLeft = frequency - trainRemaining;
  

    //next arrival time
    var nextArrival = moment().add(minutesLeft, "minutes").format('hh:mm');
    

    //adding info to DOM table 
    $("#train-table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesLeft + "</td></tr>");

  });
});