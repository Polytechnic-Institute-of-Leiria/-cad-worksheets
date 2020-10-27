$(function () {
  'use strict';

  const tempToggle = $("#temp-toggle");
  const tempTime = $("#temp_time");
  let kitchen = {
    temp: {
      status: false,
      time: null
    },
    light: {
      status: false,
      time: null
    }
  }
  const lightToggle = $("#light-toggle");
  const lightTime = $("#light_time")


  let temperature = null; 
  function toggleButton(e) {
    if (this == tempToggle.get(0)) {
      kitchen.temp.status = !kitchen.temp.status
      kitchen.temp.time = new Date();
      tempTime.text('just now');
      localStorage.setItem("kitchen_temp_status", kitchen.temp.status);
      localStorage.setItem("kitchen_temp_time", kitchen.temp.time.toISOString());
    }
    else if (this == lightToggle.get(0)) {
      kitchen.light.status = !kitchen.light.status;
      kitchen.light.time = new Date();
      lightTime.text('just now');
      localStorage.setItem("light_temp_status", kitchen.light.status);
      localStorage.setItem("light_temp_time", kitchen.light.time.toISOString());
    }
    const j = $(this).find("i");
    j.toggleClass("fa-toggle-off");
    j.toggleClass("fa-toggle-on");

    sendToCloud({"kitchen": kitchen});
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

  tempToggle.on ('click', toggleButton);
  tempToggle.click (changeTemperature);
  
  lightToggle.click(toggleButton);
  lightToggle.click(changeLightBulb);

  changeTemperature ();

  function updateKitchenTime(time, textNode) {
    let now = Date.now();
    if (!time) {
      return;
    }
    let sec = (now - time.getTime())/1000;
    if (sec < 60) {
      textNode.text(sec.toFixed(0) + " secs ago");
    }
    else {
      let min = sec / 60;
      if (min < 60) {
        textNode.text(min.toFixed(0) + " min ago");
      }
      else {
        let hours = min / 60;
        textNode.text(hours.toFixed(0) + " hours");
      }
    }
  }

  var kitchenTimer = setInterval (function() {
    updateKitchenTime(kitchen.temp.time, tempTime);
    updateKitchenTime(kitchen.light.time, lightTime);  
  }, 1000);


  function loadInitialValues() {
    kitchen.temp.status = Boolean(localStorage.getItem("kitchen_temp_status"));
    let storedTime = localStorage.getItem("kitchen_temp_time");
    if (storedTime) {
      kitchen.temp.time = new Date (storedTime);
    }
  
    kitchen.light.status = Boolean (localStorage.getItem("light_temp_status"));
    storedTime = localStorage.getItem("light_temp_time");
    if (storedTime) {
      kitchen.light.time = new Date(storedTime);
    }
    updateKitchenTime(kitchen.temp.time, tempTime);
    updateKitchenTime(kitchen.light.time, lightTime);
  }

  loadInitialValues();

  const firebaseURL = "https://ipleiria-marcelino.firebaseio.com/dad2020/​000.json"

  function sendToCloud(dataToSend) {
    $.ajax({
      url: firebaseURL,
      type: 'PUT',
      data: JSON.stringify(dataToSend),
      contentType: 'application/json',
    }).done(function (data) {
      
    }
    )
  }


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
