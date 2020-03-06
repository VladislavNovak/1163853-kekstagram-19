// -----------------effects.js--------------------------------------------------------
// Изменение глубины эффекта, накладываемого на изображение:----------
'use strict';

(function () {
  var slider = document.querySelector('.img-upload__effect-level');
  var sliderValue = slider.querySelector('.effect-level__value');
  var scale = slider.querySelector('.effect-level__line');
  var pin = slider.querySelector('.effect-level__pin');
  var yellowLine = slider.querySelector('.effect-level__depth');

  // m5t3---------------------------------------------------

  var setPosition = function (value, width) {
    pin.style.left = value + 'px';

    var effect = Math.floor(value * 100 / width);

    sliderValue.value = effect;
    yellowLine.style.width = effect + '%';
  };

  pin.addEventListener('mousedown', function (evtDown) {
    // предотвратить запуск выделения (действие браузера):
    evtDown.preventDefault();
    // получаем ширину шкалы (линии):
    var scaleWidth = scale.offsetWidth;
    // координаты первоначальной точки (потом - будем обновлять):
    var start = evtDown.clientX;

    var onMouseMove = function (evtMove) {
      evtMove.preventDefault();
      // в зависимости от направления, прибавляем/вычитаем единицу:
      var shift = start - evtMove.clientX;
      // теперь же смещение (+/- 1) добавляем к текущему положению пина:
      var position = pin.offsetLeft - shift;

      // курсор вышел из слайдера - оставить бегунок в его границах:
      if (position < 0) {
        position = 0;
      } else if (position > scaleWidth) {
        position = scaleWidth;
      } else {
        setPosition(position, scaleWidth);
      }

      // обновляем обновляем стартовуюю точку:
      start = evtMove.clientX;
    };

    var onMouseUp = function (evtUp) {
      evtUp.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseUp', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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

      // получаем ширину шкалы (линии):
      var scaleWidth = scale.offsetWidth;
      setPosition(scaleWidth, scaleWidth);

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

