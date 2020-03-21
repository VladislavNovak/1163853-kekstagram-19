// --------------upload.js------------------------------------
// поле для загрузки изображения .upload-file

'use strict';

(function () {
  var KEY_ESC = 'Escape';
  var KEY_ENTER = 'Enter';

  // флаг - находится ли инпут с хэштегами в фокусе
  var isFocusOnHashTagInput = false;

  var body = document.body;
  // сюда будем размещать сообщение о удачной/неудачной загрузке из request:
  var main = document.querySelector('main');
  // корневой объект загрузки изображений:
  var imgUpload = document.querySelector('.img-upload');
  // открытие файла:
  var imgUploadInput = imgUpload.querySelector('.img-upload__input');
  // закрытие поля выбора файла:
  var imgUploadCancel = imgUpload.querySelector('.img-upload__cancel');
  // форма редактирования изображения:
  var imgUploadOverlay = imgUpload.querySelector('.img-upload__overlay');
  // инпут с хэштегами:
  var hashTagsInput = imgUpload.querySelector('.text__hashtags');
  // будем отправлять данные формы на сервер:
  var form = imgUpload.querySelector('.img-upload__form');

  // -------- Обработчики событий мыши/клавиатуры в контексте .img-upload__overlay: -------

  // при закрытии .img-upload__input:
  var closeUploadWindow = function () {
    // - скрывает форму редактирования изображения:
    imgUploadOverlay.classList.add('hidden');
    // - body снова можно прокручивать:
    body.classList.remove('modal-open');
    // - обнуляем .img-upload__input:
    imgUploadInput = '';
  };

  var onDocumentToCloseUploadWindowEsc = function (evt) {
    if ((evt.key === KEY_ESC) && (!isFocusOnHashTagInput)) {
      closeUploadWindow();
      evt.target.removeEventListener('keydown', onDocumentToCloseUploadWindowEsc);
    }
  };

  var onImgUploadCancelEnter = function (evt) {
    if (evt.key === KEY_ENTER) {
      closeUploadWindow();
    }
  };

  var onImgUploadCancelClick = function () {
    closeUploadWindow();
  };

  // .img-upload__input открывает .img-upload__overlay
  var showUploadWindow = function () {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
  };

  var onImgUploadInputChange = function () {
    showUploadWindow();
  };

  var onInputFocus = function () {
    isFocusOnHashTagInput = true;
  };

  var onInputBlur = function () {
    isFocusOnHashTagInput = false;
  };

  // .text__hashtags в фокусе (--/--):
  hashTagsInput.addEventListener('focus', onInputFocus);
  // .text__hashtags фокус снят (--/--):
  hashTagsInput.addEventListener('blur', onInputBlur);
  // при изменении .img-upload__input (добавлен/--):
  imgUploadInput.addEventListener('change', onImgUploadInputChange);
  // click на .img-upload__cancel (--/--):
  imgUploadCancel.addEventListener('click', onImgUploadCancelClick);
  // закрытие через Escape (добавлен/удалён):
  document.addEventListener('keydown', onDocumentToCloseUploadWindowEsc);
  // если фокус на .img-upload__cancel, закрытие через enter (добавлен/удалён):
  imgUploadCancel.addEventListener('keydown', onImgUploadCancelEnter);

  // -------------- действия при сохранении данных на сервер: ------------

  // выводит сообщение об успехе загрузки данных на сервер:
  var showMessage = function () {
    // Разметку сообщения, которая находится блоке #success внутри шаблона template:
    var templateSuccessWindow = document.querySelector('#success').content.querySelector('.success');
    // - клонирует в окно, с которым и будем работать:
    var successWindow = templateSuccessWindow.cloneNode(true);
    // - добавляет в окно с ошибкой в main:
    main.insertAdjacentElement('afterbegin', successWindow); // main.appendChild(successWindow);

    // Обработка событий клавиатуры в контексте .success: --------------

    // закрывает окно .success__button:
    var successButton = successWindow.querySelector('.success__button');

    var closeSuccessWindow = function () {
      if (main.querySelector('.success')) {
        main.querySelector('.success').remove();
      }
    };

    var onSuccessButtonClick = function (evt) {
      closeSuccessWindow();
      evt.target.removeEventListener('click', onSuccessButtonClick);
    };

    var onDocumentToCloseSuccessWindowEsc = function (evt) {
      if (evt.key === KEY_ESC) {
        closeSuccessWindow();
        evt.target.addEventListener('keydown', onDocumentToCloseSuccessWindowEsc);
      }
    };

    var onMainToCloseSuccessWindowClick = function (evt) {
      if (!evt.target.closest('.success__inner')) {
        closeSuccessWindow();
        evt.target.addEventListener('click', onMainToCloseSuccessWindowClick);
      }
    };

    // - при клике на .success__button (добавлен/удалён):
    successButton.addEventListener('click', onSuccessButtonClick);
    // - по нажатию на клавишу Esc (добавлен/удалён):
    document.addEventListener('keydown', onDocumentToCloseSuccessWindowEsc);
    // - по клику на произвольную область экрана (добавлен/удалён):
    main.addEventListener('click', onMainToCloseSuccessWindowClick);
  };

  // После успешной передачи данных на сервер:
  var onSuccess = function () {
    // - форма редактирования возвращается в исходное состояние:
    window.effects.reset();
    // - все данные, введённые в форму сбрасываются:
    form.reset();
    // - форма редактирования закрывается:
    closeUploadWindow();
    // - информирует об успешной отправке данных:
    showMessage();
  };

  // ---------- В случае невозможности сохранение данных на сервер: -------------

  var onError = function (messageError) {
    // - находит шаблон template error...
    var templateErrorWindow = document.querySelector('#error').content.querySelector('.error');
    // - клонирует в окно, с которым и будет работать:
    var errorWindow = templateErrorWindow.cloneNode(true);
    // - добавляет сообщение об ошибке в errorWindow:
    errorWindow.querySelector('.error__title').textContent = messageError;
    // - добавляет окно с ошибкой в main:
    main.insertAdjacentElement('afterbegin', errorWindow);

    // Обработка событий клавиатуры в контексте .error: --------------

    // кнопка закрытия окна .error:
    var errorButton = errorWindow.querySelector('.error__button');

    // закрытие окна .error:
    var closeErrorWindow = function () {
      if (main.querySelector('.error')) {
        main.querySelector('.error').remove();
      }
    };

    var onMainToCloseErrorWindowClick = function (evt) {
      if (evt.target.closest('.error__inner')) {
        closeErrorWindow();
      }
    };

    var onDocumentToCloseErrorWindowEsc = function (evt) {
      if (evt.key === KEY_ESC) {
        closeErrorWindow();
        evt.target.removeEventListener('keydown', onDocumentToCloseErrorWindowEsc);
      }
    };

    var onErrorButtonClick = function () {
      closeErrorWindow();
    };

    // при клике на .error__button (--/--):
    errorButton.addEventListener('click', onErrorButtonClick);
    // по нажатию на клавишу Esc (добавлен/удалён):
    document.addEventListener('keydown', onDocumentToCloseErrorWindowEsc);
    // по клику на произвольную область экрана (--/--):
    main.addEventListener('click', onMainToCloseErrorWindowClick);
  };

  // ---------Сохранение формы (и отправка на сервер):----------------

  // обрабатывает успешный/неудачный сценарий
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onError, onSuccess);
  });
})();
