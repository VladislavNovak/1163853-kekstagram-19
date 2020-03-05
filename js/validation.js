// -----------------validation.js---------------------------------------------
// Проверка хэштегов на валидацию:
'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');
  var hashtagsInput = uploadForm.querySelector('.text__hashtags');
  var imgUploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var textDescription = uploadForm.querySelector('.text__description');
  // максимальное количество хэштегов:
  var MAX_QUANTITY_HASHTAGS = 5;
  var stopSubmit = false;

  hashtagsInput.addEventListener('input', function (evt) {
    // вызывающий объект (this):
    var target = evt.target;
    target.setCustomValidity('');
    stopSubmit = false;

    // регулярные выражения:
    var divider = /\s+/;
    var pattern = /^#([A-Za-z0-9А-Яа-я]{2,19})$/;
    // формируем массив, удаляя боковые пробелы, разделяя по внутренним пробелам:
    var hashTags = target.value.trim().split(divider);

    // проверяем количество введённых тегов:
    if (hashTags.length > MAX_QUANTITY_HASHTAGS) {
      stopSubmit = true;
      target.setCustomValidity('Максимальное количество тегов: ' + MAX_QUANTITY_HASHTAGS + ' превышено');
    }

    // проверяем по соответствию шаблону ^#([A-Za-z0-9А-Яа-я]{2,19})$:
    for (var i = 0; i < hashTags.length; i++) {
      var hashTag = hashTags[i];
      if (!pattern.test(hashTag)) {
        stopSubmit = true;
        target.setCustomValidity('Хэштег "' + hashTag + '" должен соответствовать шаблону: # за которым следуют любые не специальные символы (от двух до 20-и) без пробелов)');
      }
    }

    // сортируем и проверяем совпадение хэштегов:
    var sortedHashTags = hashTags.slice().sort();
    for (var j = 0; j < hashTags.length - 1; j++) {
      if (sortedHashTags[j] === sortedHashTags[j + 1]) {
        stopSubmit = true;
        target.setCustomValidity('Необходимо удалить хэштег ' + sortedHashTags[j] + ' т.к. он уже используется!');
      }
    }
  });

  // если хотя бы одна проверка не пройдена, прервать отправление формы:
  imgUploadSubmit.addEventListener('submit', function (evt) {
    if (stopSubmit) {
      evt.preventDefault();
      return;
    }
  });

  // длина комментария не может составлять больше 140 символов:
  textDescription.addEventListener('invalid', function () {
    if (textDescription.validity.tooLong) {
      textDescription.setCustomValidity('Длина комментария не может составлять больше 140 символов!');
    } else {
      textDescription.setCustomValidity('');
    }
  });

})();

