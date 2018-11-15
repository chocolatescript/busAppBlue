function getDirectionInfo(currentLocation, destination, callback) {
    var xhr = new XMLHttpRequest();
    var uri = "https://www.jayteesf.com/test/geo.json?origin=" + currentLocation + "&destination=" + destination;
    var url = encodeURI(uri);
    console.log("Going to url: " + url);
    xhr.onload = function () {
        callback(JSON.parse(xhr.responseText));
    }
    xhr.open("GET", url, true);
    return xhr.send();
}

// good job: it is getting info from the box that you type in, "Cabrillo Middle School"
function getDestination() {
    return document.getElementById("destinationField").value;
}

// todo: make this function extract the part you need:
function alertParameter(destinationInfo, currentDestination, now) {
    var duration = destinationInfo.routes[0].legs[0].duration.value;
    
    //FIXME: stuff this information in a database so the other app can know how-long till the bus arrives:
    alert(duration.toString() + " seconds to get to " + currentDestination + " as of " + now.toString());
}

//Determines longitude and latitude 
function showPosition(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var latLong = lat.toString() + "," + long.toString();
    console.log(latLong);
    var currentDestination = getDestination();
    
    // get the currenttime (in seconds)
    var date = new Date();
    var now = date.getTime();

    var anonymousFn = function(destinationInfo) { alertParameter(destinationInfo, currentDestination, now); };
    getDirectionInfo(latLong, currentDestination, anonymousFn);
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    // until you're on an iphone or this is hosted on a website use this:
    //showPosition(fakeCurrentLatLon())
}


// this is the start of the code:
getLocation();
var timer = setInterval(getLocation, 60000);

// notice how this function can be used to clear _any_ timer that you pass-in
//however it will (by default) clear the variable named `timer`
function clearTimer(currentTimer = timer) {
    clearInterval(currentTimer);
}

/* you called the code like this:
 * getDirectionInfo(oldFakeCurrentLatLon(), getDestination(), alertParameter)
 */
//we were able to get the alert into the console so we can play with it and figure out the duration with an object

// Nov 14, 2018 - need to use timers ...but how?
// you rightly searched (google) for: 'w3schools timer in javascript'
// got to: https://www.w3schools.com/jsref/met_win_setinterval.asp
