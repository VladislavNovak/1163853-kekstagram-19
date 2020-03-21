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
    // - заполняем инпут:
    sliderValue.value = effect;
    // - формирует длину жёлтой полоски левее пина:
    yellowLine.style.width = effect + '%';
  };

  // в зависимости от пропорции - меняем эффект:
  var changeFilter = function (effect) {
    if (preview.classList.contains('effects__preview--chrome')) {
      // - для эффекта «Хром» — filter: grayscale(0..1);
      preview.style.filter = 'grayscale(' + effect + '%)'; // * 0.1
    } else if (preview.classList.contains('effects__preview--sepia')) {
      // - для эффекта «Сепия» — filter: sepia(0..1);
      preview.style.filter = 'sepia(' + effect + '%)'; // * 0.1
    } else if (preview.classList.contains('effects__preview--marvin')) {
      // - для эффекта «Марвин» — filter: invert(0..100%);
      preview.style.filter = 'invert(' + effect + '%)';
    } else if (preview.classList.contains('effects__preview--phobos')) {
      // - для эффекта «Фобос» — filter: blur(0..3px);
      preview.style.filter = 'blur(' + (effect * 3 / 100) + 'px)';
    } else if (preview.classList.contains('effects__preview--heat')) {
      // - для эффекта «Зной» — filter: brightness(1..3);
      preview.style.filter = 'brightness(' + (effect * 3 / 100) + ')';
    }
  };

  // когда ЛКМ опущена:
  pin.addEventListener('mousedown', function (evtDown) {
    // - предотвратить запуск выделения (действие браузера):
    evtDown.preventDefault();
    // - получает ширину шкалы (линии):
    var lineOfRangeWidth = lineOfRange.offsetWidth;
    // - получает координаты первоначальной точки (здесь*** - будем обновлять):
    var start = evtDown.clientX;

    // когда ЛКМ перемещается:
    var onMouseMove = function (evtMove) {
      evtMove.preventDefault();
      // - в зависимости от направления, прибавляет/вычитает единицу:
      var shift = start - evtMove.clientX;
      // - и смещение (+/- 1) добавляется к текущему положению пина:
      var position = pin.offsetLeft - shift;

      // если курсор вышел из слайдера:
      if (position < 0) {
        // - оставить бегунок в его границах:
        position = 0;
      } else if (position > lineOfRangeWidth) {
        // в противном случае => получает ширину шкалы:
        position = lineOfRangeWidth;
      } else {
        // в остальных случаях => устанавливаем положение пина, инпут.value, размер жёлтой полоски:
        setPosition(position, lineOfRangeWidth);
        // - получает пропорцию и изменяем в соответствии с ним эффект:
        var change = getRatio(position, lineOfRangeWidth);
        changeFilter(change);
      }

      // здесь*** обновляем стартовую точку:
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

  // скидываем всё до первоначальных настроек:
  var resetToInitialSettings = function () {
    // - получаем ширину шкалы (линии):
    var lineOfRangeWidth = lineOfRange.offsetWidth;
    // - устанавливаем положение пина, инпут.value, размер жёлтой полоски:
    setPosition(lineOfRangeWidth, lineOfRangeWidth);
    // - получаем пропорцию и изменяем в соответствии с ним эффект:
    var change = getRatio(lineOfRangeWidth, lineOfRangeWidth);
    changeFilter(change);
  };

  // при первом открытии окна:
  if (radios[ORIGIN].checked) {
    // - прячем слайдер:
    slider.classList.add('hidden');
    // - скидываем до первоначальных настроек:
    resetToInitialSettings();
  }

  // понадобится при отправке формы:
  var resetAll = function () {
    // - переключим на первый радиобаттон:
    radios[ORIGIN].checked = true;
    // - скидываем всё до первоначальных настроек:
    resetToInitialSettings();
  };

  // при выборе радиобаттона:
  var onRadioClick = function (evt) {
    // если радиобаттон isChecked, то:
    if (evt.target.checked) {
      // - скидываем/обновляем уже добавленные классы;
      preview.className = '';
      // - добавляем картинке класс (составляем из названия в CSS и радиобаттон.value):
      preview.classList.add('effects__preview--' + evt.target.value);
      // - показываем слайдер:
      slider.classList.remove('hidden');
      // - скидываем всё до первоначальных настроек:
      resetToInitialSettings();
      // если выбран радиобаттон ORIGIN => прячем слайдер:
      if (preview.classList.contains('effects__preview--none')) {
        slider.classList.add('hidden');
      }
    }
  };

  // обрабатывает клик на каждом радиобаттоне .effects__radio (--?/--?):
  radios.forEach(function (radioButton) {
    radioButton.addEventListener('click', onRadioClick);
  });

  // -------------- выводим в глобальную область: ---------------------

  window.effects = {
    reset: resetAll,
  };
})();
