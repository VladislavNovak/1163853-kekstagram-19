// -----------------validation.js---------------------------------------------
// Проверка хэштегов на валидацию:

'use strict';

(function () {
  // максимальное количество хэштегов:
  var MAX_QUANTITY_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;

  // флаг - условие не прошло валидацию:
  var isErrorValidity;

  var uploadForm = document.querySelector('.img-upload__form');
  var hashTagsInput = uploadForm.querySelector('.text__hashtags');
  var imgUploadSubmit = uploadForm.querySelector('.img-upload__submit');
  var textDescription = uploadForm.querySelector('.text__description');

  var setAppearanceOfHashtagField = function () {
    // если isErrorValidity == true, устанавливаем красную рамку:
    hashTagsInput.style.boxShadow = (isErrorValidity) ? '0 0 3px 2px #B22222' : 'none';
  };

  var setDefault = function () {
    // - обнуляет сообщения об ошибках:
    hashTagsInput.setCustomValidity('');
    // - изначально устанавливаем флаг об отсутствии ошибок:
    isErrorValidity = false;
  };

  hashTagsInput.addEventListener('input', function (evt) {
    setDefault(); // <= обнуляем сообщение об ошибках, флаг isErrorValidity устанавливаем в false

    // Если есть какое-то значение, производим проверку (по условию ТЗ значения может и не быть):
    if (evt.target.value.length >= 1) {
      // регулярные выражения:
      var divider = /\s+/;
      var pattern = /^#([A-Za-z0-9А-Яа-я]{1,19})$/;
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
        // - проверяем по соответствию шаблону ^#([A-Za-z0-9А-Яа-я]{1,19})$:
        if (!pattern.test(hashTag)) {
          isErrorValidity = true;
          evt.target.setCustomValidity('Хэштег "' + hashTag + '" должен соответствовать шаблону: # за которым следуют любые не специальные символы (от одного до 20-и) без пробелов)');
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

      setAppearanceOfHashtagField(); // <= устанавливаем внешний вид .text__hashtags:
    }

    // если в .text__hashtags ничего не введено:
    if (evt.target.value.length === 0) {
      setAppearanceOfHashtagField(); // <= отключаем красную рамку
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
      setAppearanceOfHashtagField();
    } else {
      textDescription.setCustomValidity('');
    }
  });

  window.validation = {
    setDefault: setDefault,
    setAppearanceOfHashtagField: setAppearanceOfHashtagField,
  };

})();
