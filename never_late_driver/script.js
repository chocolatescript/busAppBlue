// read this file from bottom to top

// Dtl is the destination, timeTillDestination and lookupTime
function recordDtl(destination, timeTillDestination, lookupTime) {
  var xhr = new XMLHttpRequest();
  var uri = "https://www.jayteesf.com/test/store_bus_update.json?destination=" + destination + "&lookup_time=" + lookupTime.toString() + "&time_till_destination=" + timeTillDestination.toString();
  var url = encodeURI(uri);
  console.log("Going to url: " + url);

  xhr.open("GET", url, true);
  xhr.send();
}

function extractAndRecordDtl(destination, timeTillDestinationObject, lookupTime) {
  // timeTillDestination = duration
  var timeTillDestination = timeTillDestinationObject.routes[0].legs[0].duration.value;

  console.log(timeTillDestination.toString() + " seconds to get to " + destination + " as of " + lookupTime.toString());

  //stuffing information in a database:
  recordDtl(destination, timeTillDestination, lookupTime);
}

function getTimeTillDestinationObject(currentLocation, destination, callback) {
  var xhr = new XMLHttpRequest();
  var uri = "https://www.jayteesf.com/test/geo.json?origin=" + currentLocation + "&destination=" + destination;
  var url = encodeURI(uri);
  console.log("Going to url: " + url);
  xhr.onload = function () {
    var timeTillDestinationObject = JSON.parse(xhr.responseText);
    callback(timeTillDestinationObject);
  }
  xhr.open("GET", url, true);
  xhr.send();
}

// this function gets us the list of registered destinations:
function getDestinations(callback) {
  var xhr = new XMLHttpRequest();
  var uri = "https://www.jayteesf.com/test/list_destinations.json";
  var url = encodeURI(uri);
  console.log("Going to url: " + url);
  xhr.onload = function () {
    var destinations = JSON.parse(xhr.responseText);
    callback(destinations);
  }
  xhr.open("GET", url, true);
  xhr.send();
}

// Determines longitude and latitude
function processPosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var latLong = lat.toString() + "," + long.toString();
  console.log("LatLong = " + latLong);

  // get the currenttime (in seconds)
  var date = new Date();
  var lookupTime = Math.round(date.getTime() / 1000);


  var destinationListFunc = function (destinations) {
    var i;
    for (i = 0; i < destinations.length; i++) {
      var destination = destinations[i];

      // avoid storing information for missing (undefined) destinations:
      if ((typeof(destination) != "undefined") && (destination)) {
        var callExtractAndRecord = function (timeTillDestinationObject) {
          extractAndRecordDtl(destination, timeTillDestinationObject, lookupTime);
        };
        getTimeTillDestinationObject(latLong, destination, callExtractAndRecord);
      }
    }
  };

  getDestinations(destinationListFunc);
}

function getLocation() {
  console.log("getting location...");
  navigator.geolocation.getCurrentPosition(processPosition);
  // until you're on an iphone or this is hosted on a website use this:
  //processPosition(fakeCurrentLatLon())
}

// This is the start of the code:
getLocation();
var timer = setInterval(getLocation, 60000);

// notice how this function can be used to clear _any_ timer that you pass-in
// however it will (by default) clear the variable named `timer`
function clearTimer(currentTimer = timer) {
  clearInterval(currentTimer);
}

/* comments section:

 * https://www.jayteesf.com/test/bus_info_api.html
 *
 * https://www.jayteesf.com/test/unregister/Cabrillo+Middle+School.json
 * https://www.jayteesf.com/test/register/Cabrillo+Middle+School.json
 * https://www.jayteesf.com/test/list_destinations.json
 * https://www.jayteesf.com/test/store_bus_update.json?destination=Cabrillo+Middle+School&lookup_time=1542360087&time_till_destination=265
 * https://www.jayteesf.com/test/retrieve_last_bus_update.json?destination=Cabrillo+Middle+School

  you called the code like this:
  getTimeTillDestinationObject(oldFakeCurrentLatLon(), getDestination(), extractAndRecordDtl)

we were able to get the alert into the console so we can play with it and figure out the timeTillDestination with an object

 Nov 14, 2018 - need to use timers ...but how?
 you rightly searched (google) for: 'w3schools timer in javascript'
 got to: https://www.w3schools.com/jsref/met_win_setinterval.asp
 */
