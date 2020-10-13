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

  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=leiria&appid=...";

  function fetchWeather() {
    $.getJSON();
  }

});
