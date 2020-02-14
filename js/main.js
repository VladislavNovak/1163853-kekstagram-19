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

// ------------Создает коллекцию из 25 объектов--------------------------

// (с путём до фото, описанием, лайками и группой комментариев)
var getCollection = function (arrayToProcess, totalPhotos, messages, names, descriptions, totalUsers) {

  for (var i = 0; i < totalPhotos; i++) {
    arrayToProcess.push({
      url: './photos/' + (i + 1) + '.jpg',
      // description: getDescription(descriptions),
      description: getRandomItem(descriptions),
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

// --------------Отрисовывает фотографии в .pictures--------------------

createTileOfPhotos(collection);


// --------------Переменные к .big-picture--------------------

var bigPicture = document.querySelector('.big-picture');
var pathToPhoto = bigPicture.querySelector('.big-picture__img').querySelector('img');
var socialLikes = bigPicture.querySelector('.big-picture__social').querySelector('.social__likes');
var socialCaption = bigPicture.querySelector('.big-picture__social').querySelector('.social__caption');
var commentsCount = bigPicture.querySelector('.social__comment-count').querySelector('.comments-count');
var socialCommentsList = bigPicture.querySelector('.social__comments');

// показываем блок .big-picture
bigPicture.classList.remove('hidden');

// --------------Заполняет .bigPicture комметнариями--------------------

var processOneComment = function (comment) {
  var socialComment = socialCommentsList.querySelector('.social__comment').cloneNode(true);
  var avatar = socialComment.querySelector('.social__picture');
  var text = socialComment.querySelector('.social__text');

  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  text.textContent = comment.message;

  return socialComment;
};

// --------------Заполняет .bigPicture: url, описание, количество лайков---------------

var drawBigPictures = function (item) {
  // контейнер. Сюда будем помещать объекты, чтобы избежать лишних перерисовок:
  var fragment = document.createDocumentFragment();

  // заполняем путь, лайки, кол.комментариев, описание:
  pathToPhoto.src = item.url;
  socialLikes.textContent = item.likes;
  socialCaption.textContent = item.description;
  commentsCount.textContent = item.comments.length;

  for (var i = 0; i < item.comments.length; i++) {
    var comment = processOneComment(item.comments[i]);
    fragment.appendChild(comment);
  }

  // удаляем дефолтные сообщения (в разметке):
  socialCommentsList.innerHTML = '';
  // добавляем новые:
  socialCommentsList.appendChild(fragment);
};

drawBigPictures(collection[0]);

// --------------Скрываем:---------------

// блок счётчика комментариев
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
socialCommentCount.classList.add('hidden');
// блок загрузки новых комментариев
var commentsLoader = bigPicture.querySelector('.comments-loader');
commentsLoader.classList.add('hidden');

// --------------контейнер с фотографиями позади не прокручивался при скролле ---------------

var body = document.body;
body.classList.add('modal-open');
