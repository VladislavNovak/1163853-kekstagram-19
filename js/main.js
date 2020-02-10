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

var DESCRIPTS = [
  'description',
];

var TOTAL_PHOTOS = 25;
var TOTAL_USERS = 6;
var arrayPhotos = [];

// ------------Обслуживающие функции--------------------------

var getRandNumber = function (min, max) {
  var rand = min + Math.random() * (max - min);
  return Math.floor(rand);
};

var addNewItem = function (array) {
  var item = array[getRandNumber(0, array.length)];

  return item;
};

// ------------Склейка нескольких посланий--------------------------

var collectComments = function (comments) {
  var comment;
  // comment = addNewItem(comments);
  comment = comments.splice(addNewItem(comments), 1);
  var tmp = getRandNumber(0, 2);
  if (tmp) {
    comment += (' ' + addNewItem(comments));
  }
  return comment;
};

// ------------Создаёт массив комментариев--------------------------

// возвращает массив комментариев (с аватаркой, посланием, именем комментатора)
var addNewMessage = function (messages, names, totalUsers) {
  var comments = [];
  var quantityMinComments = 1;
  var quantityMaxComments = 7;

  for (var i = 0; i < getRandNumber(quantityMinComments, quantityMaxComments + 1); i++) {
    comments.push({
      avatar: './img/avatar-' + getRandNumber(1, totalUsers + 1) + '.svg',
      message: collectComments(messages),
      name: addNewItem(names),
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
var getDepictions = function (arrayToProcess, totalPhotos, messages, names, descripts, totalUsers) {
  var minLikes = 15;
  var maxLikes = 200;

  for (var i = 0; i < totalPhotos; i++) {
    arrayToProcess.push({
      url: './photos/' + (i + 1) + '.jpg',
      description: getDescription(descripts),
      likes: getRandNumber(minLikes, maxLikes),
      comments: addNewMessage(messages, names, totalUsers),
    });
  }

  return arrayToProcess;
};

// ------------Массив из 25 объектов--------------------------

var depictions = getDepictions(arrayPhotos, TOTAL_PHOTOS, MESSAGES, NAMES, DESCRIPTS, TOTAL_USERS);


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

renderPhotos(depictions);
