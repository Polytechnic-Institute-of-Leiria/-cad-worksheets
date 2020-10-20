$(function () {
  'use strict';

  let temperature = null; 
  function toggleButton(e) {
    const j = $(this).find("i");
    j.toggleClass("fa-toggle-off");
    j.toggleClass("fa-toggle-on");
    e.preventDefault();
  };

  function changeTemperature () {
    temperature = Math.random()*40;
    const jtempNode = $("#temp-indicator");
    jtempNode.text (Number(temperature).toFixed(1));
  }

  function changeLightBulb () {
    const bulbNode = $("#bulb i");
    bulbNode.toggleClass("far");
    bulbNode.toggleClass("fas");
    if (bulbNode.css("color") == "rgb(255, 0, 0)" ) {
      bulbNode.css("color", "rgb(0, 0, 0)");
    }
    else {
      bulbNode.css("color", "rgb(255, 0, 0)");
    }
  }


  const tempToggle = $("#temp-toggle");
  tempToggle.on ('click', toggleButton);
  tempToggle.click (changeTemperature);
  
  const lightToggle = $("#light-toggle");
  lightToggle.click(toggleButton);
  lightToggle.click(changeLightBulb);

  changeTemperature ();

  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=leiria&appid=45560d6d409b8b4b31f5ff22a8f451aa";

  var timeOfUpdate = null;
  var intervalID = null;

  function fetchWeather() {
    $.getJSON(weatherUrl, function (data) {
      timeOfUpdate = Date.now();
      updateFetchedTime();
      
      $("#weather-temp").text(data.main.temp);
      $("#weather-max-temp").text(data.main.temp_max);
      $("#weather-min-temp").text(data.main.temp_min);
      $('#weather-humidity').text(data.main.humidity);
      $('#weather-sunrise').text(new Date(data.sys.sunrise*1000).toLocaleTimeString());
      $('#weather-sunset').text(new Date(data.sys.sunset*1000).toLocaleTimeString());
      // update time in "updated at"

      if (intervalID) {
        intervalID.clearInterval();
      }
      intervalID = setInterval(updateFetchedTime, 1000);

      console.log(data);
    });
  };

  function updateFetchedTime () {
    let now = Date.now();
    let secondsDiff = (now - timeOfUpdate)/1000;
    if (secondsDiff < 60) {
      $('#weather-updated').text(secondsDiff.toFixed(0) + " sec.");
    }
    else {
      let minutesDiff = secondsDiff / 60;
      if (minutesDiff < 60) {
        $('#weather-updated').text(minutesDiff.toFixed(0) + " min.");
      }
      else {
        let hoursDiff = minutesDiff / 24;
        $('#weather-updated').text(hoursDiff.toFixed(0) + " h");
      }
    }
  }

  fetchWeather();

});
