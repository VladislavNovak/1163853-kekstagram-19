// --------------base.js---------------------------------------------------------
// Создание базы для отрисовки всех фотографий:

'use strict';

(function () {
  var KEY_ESC = 'Escape';
  // сюда будем размещать сообщение о удачной/неудачной загрузке из request:
  var main = document.querySelector('main');

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

    // - обрабатывает клик по картинке .picture (--?/--?):
    gallery.forEach(function (icon, index) {
      icon.addEventListener('click', function () {
        window.representation.draw(dataForRender[index]);
      });
    });
  };

  // ------ В случае успешной загрузки с сервера: -----------------------------

  var onSuccess = function (data) {
    // - сохраняем в переменную, которую передадим в глобальный объект:
    window.serverData = data.slice();
    window.filters.sort();
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

    // Обработчики событий мыши/клавиатуры в контексте .error: ---------

    // клавиша закрытия .error:
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

    // - при клике на .error__button (--/--):
    errorButton.addEventListener('click', onErrorButtonClick);
    // - по нажатию на клавишу Esc (добавлен/удалён):
    document.addEventListener('keydown', onDocumentToCloseErrorWindowEsc);
    // клик на произвольную область экрана (--/--):
    main.addEventListener('click', onMainToCloseErrorWindowClick);
  };

  // --------- Загрузка с сервера: --------------------------------------------

  // обрабатывает успешный/неудачный сценарий
  window.backend.load(onError, onSuccess);

  // --------- Глобальная область: --------------------------------------------
  window.base = {
    renderData: renderData,
  };
})();
