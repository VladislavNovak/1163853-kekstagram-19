// -----------------effects.js--------------------------------------------------------
// Изменение глубины эффекта, накладываемого на изображение:----------
'use strict';

(function () {
  // первый радиобаттон. Нужен, чтобы изначально отключить слайдер
  var ORIGIN = 0;

  var slider = document.querySelector('.img-upload__effect-level');
  var sliderValue = slider.querySelector('.effect-level__value');
  var lineOfRange = slider.querySelector('.effect-level__line');
  var pin = slider.querySelector('.effect-level__pin');
  var yellowLine = slider.querySelector('.effect-level__depth');

  var uploadForm = document.querySelector('.img-upload__form');
  var preview = uploadForm.querySelector('.img-upload__preview').querySelector('img');
  var radios = uploadForm.querySelectorAll('.effects__radio');

  // m5t3---------------------------------------------------
  // получает пропорцию исходя из текущего положения пина (value) относительно общей длины слайдера (width):
  var getRatio = function (value, width) {
    return Math.floor(value * 100 / width);
  };

  // устанавливает положение пина, инпут.value, размер жёлтой полоски:
  var setPosition = function (value, width) {
    pin.style.left = value + 'px';

    var effect = getRatio(value, width);
    // заполняем инпут:
    sliderValue.value = effect;
    // формируем длину жёлтой полоски левее пина:
    yellowLine.style.width = effect + '%';
  };

  // в зависимости от пропорции - меняем эффект:
  var changeFilter = function (effect) {
    if (preview.classList.contains('effects__preview--chrome')) {
      // Для эффекта «Хром» — filter: grayscale(0..1);
      preview.style.filter = 'grayscale(' + effect + '%)'; // * 0.1
    } else if (preview.classList.contains('effects__preview--sepia')) {
      // Для эффекта «Сепия» — filter: sepia(0..1);
      preview.style.filter = 'sepia(' + effect + '%)'; // * 0.1
    } else if (preview.classList.contains('effects__preview--marvin')) {
      // Для эффекта «Марвин» — filter: invert(0..100%);
      preview.style.filter = 'invert(' + effect + '%)';
    } else if (preview.classList.contains('effects__preview--phobos')) {
      // Для эффекта «Фобос» — filter: blur(0..3px);
      preview.style.filter = 'blur(' + (effect * 3 / 100) + 'px)';
    } else if (preview.classList.contains('effects__preview--heat')) {
      // Для эффекта «Зной» — filter: brightness(1..3);
      preview.style.filter = 'brightness(' + (effect * 3 / 100) + ')';
    }
  };

  pin.addEventListener('mousedown', function (evtDown) {
    // предотвратить запуск выделения (действие браузера):
    evtDown.preventDefault();
    // получаем ширину шкалы (линии):
    var lineOfRangeWidth = lineOfRange.offsetWidth;
    // координаты первоначальной точки (здесь*** - будем обновлять):
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
      } else if (position > lineOfRangeWidth) {
        position = lineOfRangeWidth;
      } else {
        // иначе => устанавливаем положение пина, инпут.value, размер жёлтой полоски:
        setPosition(position, lineOfRangeWidth);
        // получаем пропорцию и изменяем в соответствии с ним эффект:
        var change = getRatio(position, lineOfRangeWidth);
        changeFilter(change);
      }

      // здесь*** обновляем стартовуюю точку:
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

  if (radios[ORIGIN].checked) {
    slider.classList.add('hidden');
  }

  // если радиобаттон isChecked, то...
  var onRadioClick = function (evt) {
    if (evt.target.checked) {
      // обнуляем уже добавленные классы;
      preview.className = '';
      // добавляем картинке класс (составляем из названия в CSS и радиобаттон.value):
      preview.classList.add('effects__preview--' + evt.target.value);

      // если выбран радиобаттон ORIGIN, то слайдер прячется
      if (preview.classList.contains('effects__preview--none')) {
        slider.classList.add('hidden');
      } else {
        slider.classList.remove('hidden');
        // получаем ширину шкалы (линии):
        var lineOfRangeWidth = lineOfRange.offsetWidth;
        // устанавливаем положение пина, инпут.value, размер жёлтой полоски:
        setPosition(lineOfRangeWidth, lineOfRangeWidth);
        // получаем пропорцию и изменяем в соответствии с ним эффект:
        var change = getRatio(lineOfRangeWidth, lineOfRangeWidth);
        changeFilter(change);
      }
    }
  };

  // обрабатывает клик на каждом радиобаттоне .effects__radio:
  for (var a = 0; a < radios.length; a++) {
    radios[a].addEventListener('click', onRadioClick);
  }
})();
