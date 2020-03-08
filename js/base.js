// --------------base.js---------------------------------------------------------
// Создание базы для отрисовки всех фотографий:
'use strict';

(function () {
  // константы и переменные

  var MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ];

  var NAMES = [
    'Захар', 'Евдоким', 'Еремей', 'Фрол', 'Игнатий', 'Осип', 'Игнат', 'Афанасий', 'Никодим', 'Радослав',
    'Дементий', 'Домна', 'Агата', 'Дорофея', 'Фекла', 'Платонида', 'Устинья', 'Иоанна', 'Декабрина', 'Зарина',
    'Виолетта', 'Викторина', 'Снежана', 'Милослава', 'Евпраксия',
  ];

  var DESCRIPTIONS = [
    'Разорванное фото склеить можно. Разорванную душу - никогда',
    'Хэллоуин близится... а ты уже купил топор к празднику?',
    'Главное - верить в себя. Мнение окружающих меняется ежедневно',
    'Я не часто снимаю селфи, но когда доходят руки…',
    'Разве не потрясающе?',
    'Открываю для себя мир. Скоро вернусь',
    'Калории, набранные в отпуске, не считаются',
    'Если жизнь подкидывает мне лимоны, я делаю из них лимонад',
    'Если бы у меня было чувство юмора, я бы придумал подпись посмешнее',
    'Пришел, увидел, забыл, что хотел',
    'Нельзя просто так взять и сочинить глубокомысленный текст для фото',
    'Вторник – день вкусняшек',
    'Сонное воскресенье и по традиции сонное селфи',
    'Среда. Время поделиться умной цитатой',
    'Выходные, пожалуйста, не оставляйте меня сейчас!',
    'Бесит, когда спрашивают: "Вы расстались? Прошла любовь, завяли помидоры?" За своим огородом следи, дачница херова!',
    'Как много девушек хороших мечтают в тайне о плохом',
    'Отличных выходных',
  ];

  var TOTAL_PHOTOS = 25;
  var TOTAL_USERS = 6;
  var arrayPhotos = [];
  var QUANTITY_MINIMUM_COMMENTS = 1;
  var QUANTITY_MAXIMUM_COMMENTS = 7;
  var MINIMUM_LIKES = 15;
  var MAXIMUM_LIKES = 200;

  // Склейка нескольких посланий:
  var collectComments = function (messages) {
    var message1 = window.randomizer.getItem(messages);
    var message2 = window.randomizer.getItem(messages);
    while (message1 === message2) {
      message2 = window.randomizer.getItem(messages);
    }
    message1 += ' ' + message2;

    return message1;
  };

  // Возвращает массив комментариев (с аватаркой, посланием, именем комментатора)
  var addNewMessage = function (messages, names, totalUsers) {
    var comments = [];

    for (var i = 0; i < window.randomizer.getNumber(QUANTITY_MINIMUM_COMMENTS, QUANTITY_MAXIMUM_COMMENTS + 1); i++) {
      comments.push({
        avatar: './img/avatar-' + window.randomizer.getNumber(1, totalUsers + 1) + '.svg',
        message: collectComments(messages),
        name: window.randomizer.getItem(names),
      });
    }

    return comments;
  };

  // Создает коллекцию из 25 объектов (с путём до фото, описанием, лайками и группой комментариев):
  var getCollection = function (arrayToProcess, totalPhotos, messages, names, descriptions, totalUsers) {

    for (var i = 0; i < totalPhotos; i++) {
      arrayToProcess.push({
        url: './photos/' + (i + 1) + '.jpg',
        description: window.randomizer.getItem(descriptions),
        likes: window.randomizer.getNumber(MINIMUM_LIKES, MAXIMUM_LIKES),
        comments: addNewMessage(messages, names, totalUsers),
      });
    }

    return arrayToProcess;
  };

  // Получаем массив из 25 объектов:
  var collection = getCollection(arrayPhotos, TOTAL_PHOTOS, MESSAGES, NAMES, DESCRIPTIONS, TOTAL_USERS);

  // Обрабатываем шаблон. Передаём одно описание к фотографии:
  var processOnePhoto = function (photo) {
    // находим шаблон template picture...
    var pictureFromTemplate = document.querySelector('#picture').content.querySelector('.picture');
    // клонируем его и записываем в него данные из depiction:
    var picture = pictureFromTemplate.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    // добавляем 'клону шаблона' нужные свойства и возвращаем его
    return picture;
  };

  // В цикле создаёт похожие объекты:
  var createTileOfPhotos = function (photos) {
    // контейнер. Сюда будем помещать объекты, чтобы избежать лишних перерисовок
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      var picture = processOnePhoto(photos[i]);
      // добавляем объекты в контейнер
      fragment.appendChild(picture);
    }

    // добавляем контейнер в DOM
    var picturesBlock = document.querySelector('.pictures');
    picturesBlock.appendChild(fragment);
  };

  // Отрисовывает фотографии в .pictures:
  createTileOfPhotos(collection);

  window.base = {
    collection: collection,
  };
})();
