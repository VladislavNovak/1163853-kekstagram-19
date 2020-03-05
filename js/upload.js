// --------------upload.js-------------------------------------------------------------
// поле для загрузки изображения .upload-file
'use strict';

(function () {
  var KEY_ESCAPE = 'Escape';
  var KEY_ENTER = 'Enter';

  var body = document.body;
  // поле выбора файла:
  var imgUploadInput = document.querySelector('.img-upload .img-upload__input');
  // закрытие поля выбора файла:
  var imgUploadCancel = document.querySelector('.img-upload .img-upload__cancel');
  // форма редактирования изображения:
  var imgUploadOverlay = document.querySelector('.img-upload .img-upload__overlay');

  var onUploadPressEscape = function (evt) {
    if (evt.key === KEY_ESCAPE) {
      closeUploadWindow();
    }
  };

  document.addEventListener('keydown', onUploadPressEscape);

  // m4t2 Открывает .img-upload__input
  var showUploadWindow = function () {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
  };

  // m4t2 Закрывает .img-upload__input
  var closeUploadWindow = function () {
    imgUploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    imgUploadInput = '';
  };

  imgUploadInput.addEventListener('change', function () {
    showUploadWindow();
  });

  // закрытие через click:
  imgUploadCancel.addEventListener('click', function () {
    closeUploadWindow();
  });

  // если фокус на .img-upload__cancel, закрытие возможно через enter:
  imgUploadCancel.addEventListener('keydown', function (evt) {
    if (evt.key === KEY_ENTER) {
      closeUploadWindow();
    }
  });
})();
