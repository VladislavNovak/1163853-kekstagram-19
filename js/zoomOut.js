// -----------------zoomOut.js--------------------------------------------------------
// Изменение глубины эффекта, накладываемого на изображение:----------
'use strict';

(function () {
  var zoomOut = document.querySelector('.img-upload__scale');
  var minus = zoomOut.querySelector('.scale__control--smaller');
  var plus = zoomOut.querySelector('.scale__control--bigger');
  var counter = zoomOut.querySelector('.scale__control--value');

  minus.addEventListener('click', function () {
    var counterValue = parseInt(counter.value, 10);
    if (counterValue >= 50) {
      counterValue -= 25;
      counter.value = counterValue + '%';
    }
  });

  plus.addEventListener('click', function () {
    var counterValue = parseInt(counter.value, 10);
    if (counterValue <= 75) {
      counterValue += 25;
      counter.value = counterValue + '%';
    }
  });

})();
