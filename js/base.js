// --------------base.js---------------------------------------------------------
// Создание базы для отрисовки всех фотографий:
'use strict';

(function () {
  var KEY_ESC = 'Escape';
  // сюда будем размещать сообщение о удачной/неудачной загрузке из request:
  var main = document.querySelector('main');

  // ------------ Обработчики событий мыши/клавиатуры: ----------------------

  var closeErrorWindow = function () {
    main.querySelector('.error').remove();
    document.removeEventListener('keydown', onDocumentPressEsc);
  };

  var onDocumentClick = function (evt) {
    if (evt.target.closect('.success__inner')) {
      closeErrorWindow();
      evt.target.removeEventListener('click', onDocumentClick);
    }
  };

  var onDocumentPressEsc = function (evt) {
    if (evt.key === KEY_ESC) {
      closeErrorWindow();
    }
  };

  // ----------- Заполнение template одной единицей данных: -------------------

  // - передаём одно описание к фотографии:
  var processOnePhoto = function (photo) {
    // - находим шаблон template picture...
    var templatePictureContent = document.querySelector('#picture').content.querySelector('.picture');
    // - клонируем его и записываем в него данные из photo:
    var picture = templatePictureContent.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    // - добавляем 'клону шаблона' нужные свойства и возвращаем его
    return picture;
  };

  // ---------- Загрузка данных в DOM + обработка клика по иконкам: ------------

  var renderData = function (dataForRender) {
    // - создаёт контейнер (чтобы избежать лишних перерисовок):
    var fragment = document.createDocumentFragment();
    // - в цикле создаёт похожие объекты извлечённые реквестом:
    for (var i = 0; i < dataForRender.length; i++) {
      var picture = processOnePhoto(dataForRender[i]);
      // - и добавляет объекты в контейнер:
      fragment.appendChild(picture);
    }

    // - добавляет контейнер в DOM
    var pictures = document.querySelector('.pictures');
    pictures.appendChild(fragment);

    // - получает все картинки .picture:
    var gallery = document.querySelectorAll('.picture');

    // - обрабатывает клик по картинке .picture:
    gallery.forEach(function (icon, index) {
      icon.addEventListener('click', function () {
        window.bigPicture.draw(dataForRender[index]);
      });
    });
  };

  // ------ В случае успешной загрузки с сервера: -----------------------------

  var onSuccess = function (data) {
    // - сохраняем в переменную, которую передадим в глобальный объект:
    window.serverData = data.slice();
    window.sort.action();
    renderData(data);
  };

  // ------ В случае проблем при загрузке с сервера: --------------------------

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
    // - по нажатию на клавишу Esc:
    document.addEventListener('keydown', onDocumentPressEsc);
    // - по клику на произвольную область экрана:
    document.addEventListener('click', onDocumentClick);
  };

  // --------- Загрузка с сервера: --------------------------------------------

  // обрабатывает успешный/неудачный сценарий
  window.backend.load(onError, onSuccess);

  // --------- Глобальная область: --------------------------------------------
  window.base = {
    renderData: renderData,
  };
})();
