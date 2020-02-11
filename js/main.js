'use strict';

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
  'Захар', 'Денис', 'Константин', 'Августин', 'Игнатий', 'Осип', 'Илья', 'Афанасий', 'Руслан', 'Станислав',
  'Дементий', 'Валентина', 'Агата', 'Дорофея', 'Алиса', 'Майя', 'Алина', 'Лариса', 'Декабрина', 'Зарина',
  'Виолетта', 'Юлия', 'Снежана', 'Милослава', 'Евпраксия',
];

var DESCRIPTIONS = [
  'description',
];

var TOTAL_PHOTOS = 25;
var TOTAL_USERS = 6;
var arrayPhotos = [];
var QUANTITY_MINIMUM_COMMENTS = 1;
var QUANTITY_MAXIMUM_COMMENTS = 7;
var MINIMUM_LIKES = 15;
var MAXIMUM_LIKES = 200;

// ------------Обслуживающие функции--------------------------

var getRandNumber = function (minimum, maximum) {
  var rand = minimum + Math.random() * (maximum - minimum);

  return Math.floor(rand);
};

var getRandomItem = function (array) {
  var item = array[getRandNumber(0, array.length)];

  return item;
};

// ------------Склейка нескольких посланий--------------------------

var collectComments = function (messagesToProcess) {
  // для того, чтобы склеенные сообщения были уникальными:
  // 1. getRandomItem возвращает random элемент массива MESSAGES
  // 2. в MESSAGES посредством splice удаляется найденный random-элемент
  // 3. и он же методом splice возвращается
  var message = messagesToProcess.splice(getRandomItem(messagesToProcess), 1);
  if (getRandNumber(0, 2)) {
    message += (' ' + getRandomItem(messagesToProcess));
  }

  return message;
};

// ------------Создаёт массив комментариев--------------------------

// возвращает массив комментариев (с аватаркой, посланием, именем комментатора)
var addNewMessage = function (messages, names, totalUsers) {
  var comments = [];

  for (var i = 0; i < getRandNumber(QUANTITY_MINIMUM_COMMENTS, QUANTITY_MAXIMUM_COMMENTS + 1); i++) {
    comments.push({
      avatar: './img/avatar-' + getRandNumber(1, totalUsers + 1) + '.svg',
      message: collectComments(messages),
      name: getRandomItem(names),
    });
  }

  return comments;
};

// --------------------------------------

// функция-заглушка. Если появятся дополнительные описания, её можно расширить
var getDescription = function (descriptions) {
  var item = descriptions[0];

  return item;
};

// ------------Создает коллекцию из 25 объектов--------------------------

// (с путём до фото, описанием, лайками и группой комментариев)
var getCollection = function (arrayToProcess, totalPhotos, messages, names, descriptions, totalUsers) {

  for (var i = 0; i < totalPhotos; i++) {
    arrayToProcess.push({
      url: './photos/' + (i + 1) + '.jpg',
      description: getDescription(descriptions),
      likes: getRandNumber(MINIMUM_LIKES, MAXIMUM_LIKES),
      comments: addNewMessage(messages, names, totalUsers),
    });
  }

  return arrayToProcess;
};

// ------------Получаем массив из 25 объектов--------------------------

var collection = getCollection(arrayPhotos, TOTAL_PHOTOS, MESSAGES, NAMES, DESCRIPTIONS, TOTAL_USERS);


// ---------------Обрабатываем шаблон------------------------------

// передаём одно описание к фотографии
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

// --------------В цикле создаём похожие объекты--------------------

var renderPhotos = function (photos) {
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

  return picturesBlock;
};

// --------------Отрисовывает фотографии в .pictures--------------------

renderPhotos(collection);
