// --------------upload.js------------------------------------
// поле для загрузки изображения .upload-file
'use strict';

(function () {
  var KEY_ESC = 'Escape';
  var KEY_ENTER = 'Enter';

  var body = document.body;
  // сюда будем размещать сообщение о удачной/неудачной загрузке из request:
  var main = document.querySelector('main');
  // поле выбора файла:
  var imgUploadInput = document.querySelector('.img-upload .img-upload__input');
  // закрытие поля выбора файла:
  var imgUploadCancel = document.querySelector('.img-upload .img-upload__cancel');
  // форма редактирования изображения:
  var imgUploadOverlay = document.querySelector('.img-upload .img-upload__overlay');
  // будем отправлять данные формы на сервер:
  var form = document.querySelector('.img-upload .img-upload__form');

  // ------------ Обработчики событий мыши/клавиатуры: ------------

  // при закрытии .img-upload__input:
  var closeUploadWindow = function () {
    // - скрывает форму редактирования изображения:
    imgUploadOverlay.classList.add('hidden');
    // - body снова можно прокручивать:
    body.classList.remove('modal-open');
    imgUploadInput = '';
    // - удаляет события клавиатуры/мыши:
    // imgUploadCancel.removeEventListener('click', onCancelClick);
    // imgUploadCancel.removeEventListener('keydown', onWindowKeydown);
    // document.removeEventListener('keydown', onWindowKeydown);
  };

  var onWindowKeydown = function (evt) {
    if (evt.key === KEY_ESC || evt.key === KEY_ENTER) {
      closeUploadWindow();
    }
  };

  var onCancelClick = function () {
    closeUploadWindow();
  };

  // закрытие через click на .img-upload__cancel:
  imgUploadCancel.addEventListener('click', onCancelClick);

  // закрытие через Escape:
  document.addEventListener('keydown', onWindowKeydown);
  // если фокус на .img-upload__cancel, закрытие через enter:
  imgUploadCancel.addEventListener('keydown', onWindowKeydown);

  // m4t2 Открывает .img-upload__input
  var showUploadWindow = function () {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
  };

  imgUploadInput.addEventListener('change', function () {
    showUploadWindow();
  });

  var closeSuccessWindow = function () { // -- SUCCESS --
    if (main.querySelector('.success')) {
      main.querySelector('.success').remove();
    }
    main.removeEventListener('keydown', onDocumentPressEcsToCloseSuccessWindow);
  };

  var onSuccessButtonClick = function () { // -- SUCCESS --
    closeSuccessWindow();
  };

  var onDocumentPressEcsToCloseSuccessWindow = function (evt) { // -- SUCCESS --
    if (evt.key === KEY_ESC) {
      closeSuccessWindow();
    }
  };

  var onMainClickToCloseSuccessWindow = function (evt) { // -- SUCCESS --
    if (!evt.target.closest('.success__inner')) {
      closeSuccessWindow();
    }
  };

  var closeErrorWindow = function () { // -- ERROR --
    if (main.querySelector('.error')) {
      main.querySelector('.error').remove();
    }
  };

  var onMainClickToCloseErrorWindow = function (evt) { // -- ERROR --
    if (evt.target.closest('.error__inner')) {
      closeErrorWindow();
      evt.target.removeEventListener('click', onMainClickToCloseErrorWindow);
    }
  };

  var onDocumentPressEscToCloseErrorWindow = function (evt) { // -- ERROR --
    if (evt.key === KEY_ESC) {
      closeErrorWindow();
    }
  };

  // -------------- действия при сохранении данных на сервер: ------------

  // выводит сообщение об успехе загрузки данных на сервер:
  var showMessage = function () {
    // Разметку сообщения, которая находится блоке #success внутри шаблона template:
    var templateSuccessWindow = document.querySelector('#success').content.querySelector('.success');
    // - клонирует в окно, с которым и будем работать:
    var successWindow = templateSuccessWindow.cloneNode(true);
    // - добавляет в окно с ошибкой в main:
    main.insertAdjacentElement('afterbegin', successWindow); // main.appendChild(successWindow);

    // закрывает окно .success__button:
    var successButton = successWindow.querySelector('.success__button');
    // - при клике на .success__button:
    successButton.addEventListener('click', onSuccessButtonClick);
    // - по нажатию на клавишу Esc:
    document.addEventListener('keydown', onDocumentPressEcsToCloseSuccessWindow);
    // - по клику на произвольную область экрана:
    main.addEventListener('click', onMainClickToCloseSuccessWindow);
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

  // В случае невозможности сохранение данных на сервер:
  var onError = function (messageError) {
    // - находит шаблон template error...
    var templateErrorWindow = document.querySelector('#error').content.querySelector('.error');
    // - клонирует в окно, с которым и будет работать:
    var errorWindow = templateErrorWindow.cloneNode(true);
    // - добавляет сообщение об ошибке в errorWindow:
    errorWindow.querySelector('.error__title').textContent = messageError;
    // - добавляет окно с ошибкой в main:
    main.insertAdjacentElement('afterbegin', errorWindow);

    // закрывает окно .error__button:
    var errorButton = errorWindow.querySelector('.error__button');
    // - при клике на .error__button:
    errorButton.addEventListener('click', function () {
      closeErrorWindow();
    });
    // - по нажатию на клавишу Esc в .main:
    document.addEventListener('keydown', onDocumentPressEscToCloseErrorWindow);
    // - по клику на произвольную область экрана:
    main.addEventListener('click', onMainClickToCloseErrorWindow);
  };

  // ---------Сохранение формы (и отправка на сервер):----------------

  // обрабатывает успешный/неудачный сценарий
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onError, onSuccess);
  });
})();
