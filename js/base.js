// --------------base.js---------------------------------------------------------
// Создание базы для отрисовки всех фотографий:
'use strict';

(function () {
  var KEY_ESC = 'Escape';
  // сюда будем размещать сообщение о удачной/неудачной загрузке из request:
  var main = document.querySelector('main');

  // Обрабатываем шаблон. Передаём одно описание к фотографии:
  var processOnePhoto = function (photo) {
    // находим шаблон template picture...
    var templatePictureContent = document.querySelector('#picture').content.querySelector('.picture');
    // клонируем его и записываем в него данные из photo:
    var picture = templatePictureContent.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    // добавляем 'клону шаблона' нужные свойства и возвращаем его
    return picture;
  };

  var closeErrorWindow = function () {
    main.querySelector('.error').remove();
    main.removeEventListener('keydown', onMainPressEsc);
    document.removeEventListener('click', onDocumentClick);
  };

  var onDocumentClick = function (evt) {
    if (evt.target.tagName !== 'DIV') {
      closeErrorWindow();
    }
  };

  var onMainPressEsc = function (evt) {
    if (evt === KEY_ESC) {
      closeErrorWindow();
    }
  };

  // В цикле создаёт похожие объекты извлечённые реквестом:
  var successHandler = function (data) {
    // контейнер. Сюда будем помещать объекты, чтобы избежать лишних перерисовок
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var picture = processOnePhoto(data[i]);
      // добавляем объекты в контейнер
      fragment.appendChild(picture);
    }

    // добавляем контейнер в DOM
    var picturesBlock = document.querySelector('.pictures');
    picturesBlock.appendChild(fragment);

    // получаем все картинки .picture:
    var smallPictures = document.querySelectorAll('.picture');

    // обрабатываем клик по картинке .picture:
    for (var t = 0; t < smallPictures.length; t++) {
      smallPictures[t].addEventListener('click', function (item) {
        window.bigPicture.draw(item);
      }.bind(null, data[t]));
    }
  };

  // удалить позже:
  // <template id="success">
  //   <section class="success">
  //     <div class="success__inner">
  //       <h2 class="success__title">Изображение успешно загружено</h2>
  //       <button type="button" class="success__button">Круто!</button>
  //     </div>
  //   </section>
  // </template>

  var errorHandler = function (messageError) {
    // находим шаблон template error...
    var templateErrorContent = document.querySelector('#error').content.querySelector('.error');
    // клонируем его и записываем в него данные из messageError:
    var errorBlock = templateErrorContent.cloneNode(true);
    // Возможно, нужно будет каждый раз при ошибке показывать окно:
    // errorBlock.style.dysplay = 'block';

    // добавляем сообщение об ошибке в errorBlock:
    errorBlock.querySelector('.error__title').textContent = messageError;
    // и добавляем в окно с ошибкой в main (согласно ПЗ):
    main.insertAdjacentElement('afterbegin', errorBlock);
    // main.appendChild(errorBlock);

    // кнопка, которая будет закрывать диалог:
    var errorButton = errorBlock.querySelector('.error__button');
    errorButton.addEventListener('click', function () {
      closeErrorWindow();
    });
    // проверяем нажатые клавиши в районе main (нужен ESC):
    main.addEventListener('keydown', onMainPressEsc);
    // клик на произвольную область экрана за пределами блока с сообщением:
    document.addEventListener('click', onDocumentClick);
  };

  // удалить позже:
  // <template id="error">
  //   <section class="error">
  //     <div class="error__inner">
  //       <h2 class="error__title">Ошибка загрузки файла</h2>
  //       <button type="button" class="error__button">Загрузить другой файл</button>
  //     </div>
  //   </section>
  // </template>

  window.backend.load(successHandler, errorHandler);
})();
