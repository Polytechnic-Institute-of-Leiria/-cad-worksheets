(function() {
  'use strict';

  // Your code goes here!

  function toggleButton(e) {
    let classValue = e.target.getAttribute('class')
    if (classValue.includes('-on')) {
      classValue = classValue.replace('-on', '-off');
    }
    else {
      classValue = classValue.replace('-off', '-on');
    }
    e.target.setAttribute('class', classValue);
    console.log(classValue);
  };


  const light1Toggle = document.getElementById("toggle_light_1");
  light1Toggle.addEventListener('click', toggleButton);
  //light1Toggle.setAttribute("class", "fa-toggle-on")
  


  const icon = e.target;
  console.log(e.target.querySelector('span'));
  let classValue = icon.getAttribute('class')
  if (classValue.includes('-on')) {
    classValue = classValue.replace('-on', '-off');
  }
  else {
    classValue = classValue.replace('-off', '-on');
  }
  icon.setAttribute('class', classValue);
  console.log(classValue);

  function changeLightBulb () {
    const bulbNode = document.getElementById("bulb").querySelector("i");
    let classValue = bulbNode.getAttribute("class");
    if (classValue.includes("fas ")) {
      classValue = classValue.replace("fas ", "far ");
    }
    else {
      classValue = classValue.replace("far ", "fas ");
    }
    bulbNode.setAttribute('class', classValue);
  }


})();
