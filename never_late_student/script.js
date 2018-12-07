// html calls alertBus ...read this file from top to bottom
function alertBus(busStop) {
  console.log("gonna check busStop: " + busStop);
  check(300 + 60, busStop, (function (isTimeToAlert) { // add 59 seconds to make sure that the kid isn't alerted after 300 seconds.
    if (isTimeToAlert) {
      console.log("hiding bus...");
      document.getElementById('bus').style.display='none';
      alert("Bus is 5 min. Away!!!");
      //don't repeat once we alert!
    } else {
      console.log("showing bus...");
      document.getElementById('bus').style.display='block';
      setTimeout((function() { alertBus(busStop) }), 60000);
    }
  }))
}

//dtlObject keys: destination, time_till_destination and lookup_time
function check(closeEnough, busStop, callback) {
  howClose(busStop, (function (dtlObject) {
    var duration = dtlObject.time_till_destination

    if (dtlObject.lookup_time >= startDateTime()) {
      console.log("it is today");
      callback(duration <= closeEnough);
    } else {
      console.log("it's not today");
      callback(false);
    }

  }))
}

function howClose(busStop, callback) {
  var date = new Date();
  var now = Math.round(date.getTime() / 1000);


  var xhr = new XMLHttpRequest();
  var uri = "https://www.jayteesf.com/test/retrieve_last_bus_update.json?destination=" + busStop;
  var url = encodeURI(uri);
  console.log("Going to url: " + url);
  xhr.onload = function () {
    var dtlObject = JSON.parse(xhr.responseText);
    /*
     * dtlObject example (key:value pairs):
           {
                "destination": "321 bus stop, CA",
                "time_till_destination": 259,
                "lookup_time": 1543972026
           }
           */
    callback(dtlObject);
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function startDateTime() {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  return Math.round(start.getTime() / 1000);

}
