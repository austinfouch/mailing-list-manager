/*******************************************************************************
	Author: Austin Fouch
	Date: 2017-11-15
        This script creates map using the Google Maps API to mark and center a 
        map based on user input. The map is initially centered on The Ramapo 
        College of New Jersey. The application takes in user input with the 
        address box and, using jQuery,sends an AJAX request via the $.getJSON() 
        function. Based off the the return object of the call, the map is
        centered on a specific latitude and longitude. The user's input is also 
        displayed as a list on the right side of the map. Each row of the list 
        is clickable, and each click will center the map on the clicked location.
*******************************************************************************/
var mapCanvas;
var zoom = 7;
var rcnjLat = 41.0815079;
var rcnjLng = -74.1746234;

// called once the HTML document has finished loading
$(document).ready(function() {
	console.log("Doc is ready...")
    initMap();
});

// creates Google Map object and centers on The Ramapo College of New Jersey
function initMap() {
    console.log("Creating new google map...")

    mapCanvas = document.getElementById('map');
    var map = new google.maps.Map(mapCanvas, {
		center: {lat: rcnjLat, lng: rcnjLng}, 
		zoom: zoom
    });

    $(".contact").each(function() {
        // on row click
        $(this).click(function() {
            $(".contact").each(function() {
                $(this).removeClass("success");
            });
            $(this).addClass("success");
            var tempLat = parseFloat($(this).children('.lat').text());
            var tempLong = parseFloat($(this).children('.long').text())
            map.setCenter({
				lat: tempLat, 
				lng: tempLong
			});
        });
    });

    // build lats and longs list based off of hidden fields
    var names = [];
    $(".name").each(function(){
        names.push($(this).text());
    });
    var addresses = [];
    $(".address").each(function(){
        addresses.push($(this).text());
    });
    var phones = [];
    $(".phone").each(function(){
        phones.push($(this).text());
    });
    var emails = [];
    $(".email").each(function(){
        emails.push($(this).text());
    });
    var lats = [];
    $(".lat").each(function(){
        lats.push($(this).text());
    });
    var longs = [];
    $(".long").each(function(){
        longs.push($(this).text());
    });
    // add markers
    var i = 0
    lats.forEach(function(){
        var contentString = 
            "<p>Name:  " + names[i] + "</p>" +
            "<p>Adrs:  " + addresses[i] + "</p>" +
            "<p>Phone: " + phones[i] + "</p>" +
            "<p>Email: " + emails[i] + "</p>";

        var marker = new google.maps.Marker({
            position: { lat: parseFloat(lats[i]), lng: parseFloat(longs[i]) },
            map: map,
        });
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseover', function() {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function() {
            infowindow.close();
        });
        i = i + 1;
    });
}