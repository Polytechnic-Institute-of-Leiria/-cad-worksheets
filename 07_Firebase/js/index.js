$(function () {
  'use strict';

  let sensors = {
    kitchen: {
      temp: {
        status: false,
        time: null
      },
      light: {
        status: false,
        time: null
      },
      north_window: {
        open: true,
        time: null
      },
      west_window: {
        open: false,
        time: null
      }
    },
    room: {
      temp: {
        status: false,
        time: null
      },
      light: {
        status: false,
        time: null
      }
    }
  };

  /**
   * 
   * @param {*} area name of the area
   * @param {*} name of the sensor 
   * @param {*} sensor JSON
   */
  function toggleAndSaveStatus(area, name, sensor) {
    if (sensor.status != undefined) {
      sensor.status = !sensor.status
      localStorage.setItem(area + '_' + sensor + "_status", sensor.status);
    }
    if (sensor.open != undefined) {
      sensor.open = !sensor.open
      localStorage.setItem(area + '_' + sensor + "_open", sensor.open);
    }
    
    sensor.time = new Date();
    localStorage.setItem(area + '_' + sensor + "_time", sensor.time.toISOString());
    sendToCloud(area, name, sensor);
  }

  function loadLocalStatus (area, name) {
    let sensor = sensors[area][name];
    if (sensor.status != undefined) {
      let status = localStorage.getItem(area + '_' + sensor + "_status");
      if (status != null) {
        // existe status para esta variável
        sensor.status = status;
      }  
    }
    if (sensor.open != undefined) {
      let open = localStorage.getItem(area + '_' + sensor + "_open");
      if (open != null) {
        // existe status para esta variável
        sensor.open = open;
      }  
    }
    let time = localStorage.getItem(area + '_' + sensor + "_time");
    if (time) {
      sensor.time = new Date (time);
    }
  }

  let temperature = null; 
  function toggleButton(e, area, name, sensor) {
    toggleAndSaveStatus(area, name, sensor)
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
    updateKitchenTime(sensors.kitchen.temp.time, $('kitchen_temp_time_indicator'));
    updateKitchenTime(sensors.kitchen.light.time, $('kitchen_light_time_indicator'));  
  }, 1000);



  function loadInitialValues() {
    loadLocalStatus("kitchen", "temp");
    loadLocalStatus("kitchen", "light");
    loadLocalStatus("kitchen", "north_window");
    loadLocalStatus("kitchen", "west_window");
    loadLocalStatus("room", "temp");
  }

  const firebaseURL = "https://ipleiria-marcelino.firebaseio.com/dad2020/​000/"

  function sendToCloud(area, name, sensor) {
    $.ajax({
      url: firebaseURL + 'sensors/' + area + '/' + name +'.json',
      type: 'PUT',
      data: JSON.stringify(sensor),
      contentType: 'application/json',
    }).done(function (data) {
      console.log(data);
    })
    .fail(function (error) {
      console.log(error);
    });

    $.ajax({
      url: firebaseURL + 'logs.json',
      type: 'POST',
      data: JSON.stringify({ timestamp: Date.now(), zone: area, sensor: name }),
      contentType: 'application/json',
    }).done(function (data) {
      console.log(data);
    })
    .fail(function (error) {
      console.log(error);
    })
  }

  // function loadFromCloud() {
  //   $.ajax({
  //     url: firebaseURL,
  //     type: 'GET',
  //     contentType: 'application/json',
  //   }).done(function (data) {
  //     kitchen = data.kitchen;
  //     kitchen.temp.time = new Date(kitchen.temp.time);
  //     kitchen.light.time = new Date(kitchen.light.time);
      
  //     const tempI = tempToggle.find("i");
  //     if (kitchen.temp.status != tempI.hasClass("fa-toggle-on")) {
  //       tempI.toggleClass("fa-toggle-on");
  //       tempI.toggleClass("fa-toggle-off");
  //     }
      
  //     const lightI = lightToggle.find("i"); 
  //     if (kitchen.light.status != lightI.hasClass("fa-toggle-on")) {
  //       lightI.toggleClass("fa-toggle-on");
  //       lightI.toggleClass("fa-toggle-off");
  //     }
  
  //     updateKitchenTime(kitchen.temp.time, tempTime);
  //     updateKitchenTime(kitchen.light.time, lightTime);
  //   }
  //   )
  // }



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
  loadInitialValues();
  // loadFromCloud();


  for (const area in sensors) {
    for (const sensor in sensors[area]) {
      $('#' + area + '_' + sensor + '_toggle').click(function(event) {
        toggleButton(event, area, sensor, sensors[area][sensor])
      })      
    }
  }

  changeTemperature ();


});
