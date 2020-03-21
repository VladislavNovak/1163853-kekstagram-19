// -----------------validation.js---------------------------------------------
// Проверка хэштегов на валидацию:

'use strict';

(function () {
  // максимальное количество хэштегов:
  var MAX_QUANTITY_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;

  var uploadForm = document.querySelector('.img-upload__form');
  var hashTagsInput = uploadForm.querySelector('.text__hashtags');
  var imgUploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var textDescription = uploadForm.querySelector('.text__description');

  // флаг - условие не прошло валидацию:
  var isErrorValidity;

  // если isErrorValidity = true:
  var occuredErrorValidity = function () {
    hashTagsInput.style.boxShadow = (isErrorValidity) ? '0 0 2px 2px #B22222' : 'none';
  };

  hashTagsInput.addEventListener('input', function (evt) {
    // Если есть какое-то значение, производим проверку (по условию ТЗ значения может и не быть):
    if (hashTagsInput.value) {
      // default:
      evt.target.setCustomValidity('');
      isErrorValidity = false;

      // регулярные выражения:
      var divider = /\s+/;
      var pattern = /^#([A-Za-z0-9А-Яа-я]{2,19})$/;
      // формируем массив, удаляя боковые пробелы, разделяя по внутренним пробелам:
      var hashTags = evt.target.value.toLowerCase().trim().split(divider);
      // проверяем количество введённых тегов:
      if (hashTags.length > MAX_QUANTITY_HASHTAGS) {
        isErrorValidity = true;
        evt.target.setCustomValidity('Максимальное количество тегов: ' + MAX_QUANTITY_HASHTAGS + ' превышено');
      }

      // в цикле:
      for (var i = 0; i < hashTags.length; i++) {
        var hashTag = hashTags[i];
        // - проверяем по соответствию шаблону ^#([A-Za-z0-9А-Яа-я]{2,19})$:
        if (!pattern.test(hashTag)) {
          isErrorValidity = true;
          evt.target.setCustomValidity('Хэштег "' + hashTag + '" должен соответствовать шаблону: # за которым следуют любые не специальные символы (от двух до 20-и) без пробелов)');
        }
        // - длину:
        if (hashTag.length === 1) {
          isErrorValidity = true;
          evt.target.setCustomValidity('Хэштег должен состоять хотя бы из одного символа (не #)');
        }
        // - длину:
        if (hashTag.length > MAX_LENGTH_HASHTAG) {
          isErrorValidity = true;
          evt.target.setCustomValidity('Максимальная длина хэштега - 20 символов');
        }
      }

      // сортируем и проверяем совпадение хэштегов:
      var sortedHashTags = hashTags.slice().sort();
      for (var j = 0; j < hashTags.length - 1; j++) {
        if (sortedHashTags[j] === sortedHashTags[j + 1]) {
          isErrorValidity = true;
          evt.target.setCustomValidity('Необходимо удалить хэштег ' + sortedHashTags[j] + ' т.к. он уже используется!');
        }
      }

      // если isErrorValidity = true:
      occuredErrorValidity();
    }
  });

  // если хотя бы одна проверка не пройдена, прервать отправление формы:
  imgUploadSubmit.addEventListener('submit', function (evt) {
    if (isErrorValidity) {
      evt.preventDefault();
      return;
    }
  });

  // длина комментария не может составлять больше 140 символов:
  textDescription.addEventListener('invalid', function () {
    if (textDescription.validity.tooLong) {
      textDescription.setCustomValidity('Длина комментария не может составлять больше 140 символов!');
      occuredErrorValidity();
    } else {
      textDescription.setCustomValidity('');
    }
  });

})();
