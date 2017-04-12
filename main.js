(function(){

$(document).ready(init);

var map;
var markers = [];

var config = {
    apiKey: "AIzaSyBXvDSgnlFsajR38kYcFhZy0AlW86qyT64",
    authDomain: "bus-tracker-f1eb8.firebaseapp.com",
    databaseURL: "https://bus-tracker-f1eb8.firebaseio.com",
    projectId: "bus-tracker-f1eb8",
    storageBucket: "bus-tracker-f1eb8.appspot.com",
    messagingSenderId: "373624984643"
  };

function init(){
  firebase.initializeApp(config);
  createMarkers();
  initMap(41.67, -86.25, 12);
  findlocation();
}

function findlocation(){
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function success(pos) {
  var crd = pos.coords;
  // console.log(crd.latitude);
  // console.log(crd.longitude);
  var latitude = crd.latitude;
  var longitude = crd.longitude;

  saveData(latitude, longitude);

}

function saveData(latitude, longitude){

  var location = {
    latitude : latitude,
    longitude: longitude,
  };

  var newLocationKey = firebase.database().ref().child('Location').push().key;
  var updates = {};
  updates['/Location/' + newLocationKey] = location;
  firebase.database().ref().update(updates).then(function(){
    // window.location.replace('./index.html');
  }).catch(function(error) {
    console.log(error.message);
  });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

function initMap(lat, lng, zoom){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: zoom,
    mapTypeId: 'satellite'
  });
}

function createMarkers(){
  var ref = firebase.database().ref('Location/');
  ref.once('value', function(snapshot){
    var location = snapshot.val();
    console.log(location);
    for(var i in location){
      console.log(i)
      var lat = location[i].latitude;
      var lng = location[i].longitude;
      console.log(lat, lng)
      var latLng = new google.maps.LatLng(lat,lng);
      var marker = new google.maps.Marker({
        position: latLng,
        // icon: './hotspot_pulse.jpg',
        map: map
      });
    }
  });



}

})();
