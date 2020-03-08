// -----------------zoomOut.js--------------------------------------------------------
// Изменение изменяет масштаб окна предварительного просмотра:----------
'use strict';

(function () {
  // шаг изменения изображения preview:
  var STEP = 25;
  // нижняя/верхняя граница изменения масштаба:
  var BOTTOM_LIMIT = 25;
  var TOP_LIMIT = 100;

  // блок формы с предварительным просмотром:
  var uploadForm = document.querySelector('.img-upload__form');
  // блок масштаба:
  var zoomOut = uploadForm.querySelector('.img-upload__scale');
  var minus = zoomOut.querySelector('.scale__control--smaller');
  var plus = zoomOut.querySelector('.scale__control--bigger');
  var counter = zoomOut.querySelector('.scale__control--value');
  // предварительный просмотр:
  var preview = uploadForm.querySelector('.img-upload__preview').querySelector('img');

  // ---------------------------------------------

  // клик на минусе => уменьшает значение scale__control--value с шагом в 25:
  minus.addEventListener('click', function () {
    var counterValue = parseInt(counter.value, 10);
    if (counterValue > BOTTOM_LIMIT) {
      counterValue -= STEP;
      counter.value = counterValue + '%';
      preview.style.transform = 'scale(' + parseInt(counter.value, 10) / 100 + ')';
    }
  });

  // клик на плюсе => увеличивает значение scale__control--value с шагом в 25:
  plus.addEventListener('click', function () {
    var counterValue = parseInt(counter.value, 10);
    if (counterValue < TOP_LIMIT) {
      counterValue += STEP;
      counter.value = counterValue + '%';
      preview.style.transform = 'scale(' + parseInt(counter.value, 10) / 100 + ')';
    }
  });

})();
