//Key para la la api the freeweather
var apiKey = "74769a09b1eae51e008e93b3fd9c94f9";
var $data;

$(document).ready(function () {
  getLocation();
  $("#myonoffswitch").bind("click", function () {
    if ($('#myonoffswitch').is(':checked'))
      setTemperature('C')
    else
      setTemperature('F');

  });

});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather);
  } else {
    $("#city").text("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  $("#demo").html("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
}

function showWeather(position) {
  var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID=" + apiKey;
  $.getJSON(weatherUrl, function (data) {
    setWeather(data);
  });
}

function setWeather(data) {
  var $block = '';
  $data = data;

  $("#city").text($data.name);
  setTemperature('C');
  for (var i = 0; i < data.weather.length; i++) {
    var iconUrl = "http://openweathermap.org/img/w/" + data.weather[i].icon + ".png";

    $block += '<div class="row">'
    $block += '<div class="col-xs-12">';
    $block += '<p>' + data.weather[i].description.toUpperCase() + '</p>';
    $block += '</div>';
    $block += '<div class="col-xs-">';
    $block += '<img src="' + iconUrl + '" alt=""/ >';
    $block += '</div>';
    $block += '</div>';
  }
  $("#description").append($block);
  if (data.weather.length > 1)
    $("#information").children().css("border-bottom", "1px solid white");

  $("#clouds").text(data.clouds.all + "%");
  $("#sunrise").text(epochToHuman(data.sys.sunrise));
  $("#sunset").text(epochToHuman(data.sys.sunset));
  setBackground(data.weather[0].id);
}

function setBackground(weatherId) {
  //Mejor un switch&case loop
  switch (true) {
    case weatherId < 233:
      $("#weatherBack").addClass("stormy");
      break;
    case weatherId < 522:
      $("#weatherBack").addClass("rainy");
      break;
    case weatherId < 803:
      $("#weatherBack").addClass("sunny");
      break;
    case weatherId > 802:
      $("#weatherBack").addClass("cloudly");
      break;

  }
}

//Convierto el valor en Kelvin de la Api a celsius y me quedo solo con 1 decimal
function toDegrees(temp) {
  return (temp - 273.15).toFixed(1);
}
//Convierto el valor en Kelvin de la Api a farenhei ty me quedo solo con 1 decimal
function toFahrenheit(temp) {
  return (temp * 9 / 5 - 459.67).toFixed(1);
}

function setTemperature(format) {
  if (format === 'C') {
    $("#tminima").text(toDegrees($data.main.temp_min) + "º");
    $("#temperature").text(toDegrees($data.main.temp) + "º");
    $("#tmaxima").text(toDegrees($data.main.temp_max) + "º");
  }
  else {
    $("#tminima").text(toFahrenheit($data.main.temp_min) + "º");
    $("#temperature").text(toFahrenheit($data.main.temp) + "º");
    $("#tmaxima").text(toFahrenheit($data.main.temp_max) + "º");
  }
}

//Convierto los valores devueltos del sunrise and sundown a fecha actual ojo con el desfase horario
function epochToHuman(timestampt) {
  var myDate = new Date(timestampt * 1000);
  return myDate.toString().split(' ')[4];
}
