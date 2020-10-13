(function () {
  'use strict';

  let temperature = null; 
  function toggleButton(e) {
    let classValue = e.target.getAttribute("class");
    if (classValue.includes("-off")) {
      classValue = classValue.replace("-off", "-on");
    }
    else {
      classValue = classValue.replace("-on", "-off");
    }
    e.target.setAttribute('class', classValue);
  };

  function changeTemperature () {
    temperature = Math.random()*40;
    const tempNode = document.getElementById("temp-indicator");
    tempNode.textContent = Number(temperature).toFixed(1);
  }

  function changeLightBulb () {
    const bulbNode = document.getElementById("bulb").querySelector("i");
    let classValue = bulbNode.getAttribute("class");
    if (classValue.includes("far ")) {
      classValue = classValue.replace("far ", "fas ");
      bulbNode.style.color = "#f00";
    }
    else {
      classValue = classValue.replace("fas ", "far ");
      bulbNode.style.color = "#000";
    }
    bulbNode.setAttribute('class', classValue);
  }


  const tempToggle = document.getElementById("temp-toggle");
  tempToggle.addEventListener('click', toggleButton);
  tempToggle.addEventListener('click', changeTemperature);
  
  const lightToggle = document.getElementById("light-toggle");
  lightToggle.addEventListener('click', toggleButton);
  lightToggle.addEventListener('click', changeLightBulb);

  changeTemperature ();
})();
