// -----------------effects.js--------------------------------------------------------
// Изменение глубины эффекта, накладываемого на изображение:----------
'use strict';

(function () {
  var slider = document.querySelector('.img-upload__effect-level');
  var sliderValue = slider.querySelector('.effect-level__value');
  var sliderLine = slider.querySelector('.effect-level__line');
  var sliderPin = slider.querySelector('.effect-level__pin');

  // рассчитывает эффект по положению pin относительно Line:
  var calculateRatio = function () {
    // получаем центр ручки (разделив ширину на 2):
    var pinCenter = sliderPin.offsetLeft / 2;
    // теперь получаем сдвиг центра ручки от родителя (т.е. линии):
    var pinOffsetCenterX = sliderPin.offsetLeft + pinCenter;
    // получаем ширину самого слайдера (линии):
    var lineWidth = sliderLine.offsetWidth;

    // возвращает пропорцию, исходя из положения центра pin относительно Line:
    return Math.floor(pinOffsetCenterX * 100 / lineWidth);
  };

  // пин слайдера меняет значение value:
  sliderPin.addEventListener('mouseup', function () {
    sliderValue.value = calculateRatio();
  });

  // -------------Наложение эффекта на изображение:-------------------------

  var uploadForm = document.querySelector('.img-upload__form');
  var imgUploadPreview = uploadForm.querySelector('.img-upload__preview').querySelector('img');
  var radios = uploadForm.querySelectorAll('.effects__radio');
  // первый радиобаттон. Нужен, чтобы изначально отключить слайдер
  var ORIGIN = 0;

  if (radios[ORIGIN].checked) {
    slider.classList.add('hidden');
  }

  // если радиобаттон isChecked, то...
  var onRadioClick = function (evt) {
    if (evt.target.checked) {
      // обнуляем уже добавленные классы;
      imgUploadPreview.className = '';
      // добавляем картинке класс (составляем из названия в CSS и радиобаттон.value):
      imgUploadPreview.classList.add('effects__preview--' + evt.target.value);
      // при переключении эффектов, уровень насыщенности сбрасывается до начального значения (100%):
      sliderValue.value = 100;
      // если выбран радиобаттон ORIGIN, то слайдер прячется
      if (imgUploadPreview.classList.contains('effects__preview--none')) {
        slider.classList.add('hidden');
      } else {
        slider.classList.remove('hidden');
      }
    }
  };

  // обрабатывает клик на каждом радиобаттоне .effects__radio:
  for (var a = 0; a < radios.length; a++) {
    radios[a].addEventListener('click', onRadioClick);
  }

})();

