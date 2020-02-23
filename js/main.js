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

// Склейка нескольких посланий:
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

// Возвращает массив комментариев (с аватаркой, посланием, именем комментатора)
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

// Создает коллекцию из 25 объектов (с путём до фото, описанием, лайками и группой комментариев):
var getCollection = function (arrayToProcess, totalPhotos, messages, names, descriptions, totalUsers) {

  for (var i = 0; i < totalPhotos; i++) {
    arrayToProcess.push({
      url: './photos/' + (i + 1) + '.jpg',
      description: getRandomItem(descriptions),
      likes: getRandNumber(MINIMUM_LIKES, MAXIMUM_LIKES),
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

// --------------Полноэкранный показ изображения .big-picture--------------------

var BIG_PICTURE = document.querySelector('.big-picture');
var PATH_TO_PHOTO = BIG_PICTURE.querySelector('.big-picture__img').querySelector('img');
var SOCIAL_LIKES = BIG_PICTURE.querySelector('.big-picture__social').querySelector('.social__likes');
var SOCIAL_CAPTION = BIG_PICTURE.querySelector('.big-picture__social').querySelector('.social__caption');
var COMMENTS_COUNT = BIG_PICTURE.querySelector('.social__comment-count').querySelector('.comments-count');
var SOCIAL_COMMENTS_LIST = BIG_PICTURE.querySelector('.social__comments');

// показываем блок .big-picture
BIG_PICTURE.classList.remove('hidden');

// Заполняет .big-picture комментариями:
var processOneComment = function (comment) {
  var SOCIAL_COMMENT = SOCIAL_COMMENTS_LIST.querySelector('.social__comment').cloneNode(true);
  var AVATAR = SOCIAL_COMMENT.querySelector('.social__picture');
  var text = SOCIAL_COMMENT.querySelector('.social__text');

  AVATAR.src = comment.avatar;
  AVATAR.alt = comment.name;
  text.textContent = comment.message;

  return SOCIAL_COMMENT;
};

// Заполняет .big-picture: url, описание, количество лайков:
var drawBigPictures = function (item) {
  // контейнер. Сюда будем помещать объекты, чтобы избежать лишних перерисовок:
  var FRAGMENT = document.createDocumentFragment();

  // заполняем путь, лайки, кол.комментариев, описание:
  PATH_TO_PHOTO.src = item.url;
  SOCIAL_LIKES.textContent = item.likes;
  SOCIAL_CAPTION.textContent = item.description;
  COMMENTS_COUNT.textContent = item.comments.length;

  for (var i = 0; i < item.comments.length; i++) {
    var comment = processOneComment(item.comments[i]);
    FRAGMENT.appendChild(comment);
  }

  // удаляем дефолтные сообщения (в разметке):
  SOCIAL_COMMENTS_LIST.innerHTML = '';
  // добавляем новые:
  SOCIAL_COMMENTS_LIST.appendChild(FRAGMENT);
};

drawBigPictures(collection[0]);

// Скрываем блок счётчика комментариев и блок загрузки новых комментариев:
var SOCIAL_COMMENT_COUNT = BIG_PICTURE.querySelector('.social__comment-count');
var COMMENTS_LOADER = BIG_PICTURE.querySelector('.comments-loader');
SOCIAL_COMMENT_COUNT.classList.add('hidden');
COMMENTS_LOADER.classList.add('hidden');

// контейнер с фотографиями позади не должен прокручиваться при скролле:
var BODY = document.body;
BODY.classList.add('modal-open');

// m4t2 Закрывает окно .big-picture и разрешает прокрутку фона:
var closeBigPicture = function () {
  BIG_PICTURE.classList.add('hidden');
  BODY.classList.remove('modal-open');
};

// m4t2 кнопка/событие закрытия .big-picture:
var BIG_PICTURE_CANCEL = BIG_PICTURE.querySelector('.big-picture__cancel');
BIG_PICTURE_CANCEL.addEventListener('click', function () {
  closeBigPicture();
});

// m4t2----------поле для загрузки изображения .upload-file:---------------

var KEY_ESCAPE = 'Escape';
var KEY_ENTER = 'Enter';

// поле выбора файла:
var IMG_UPLOAD_INPUT = document.querySelector('.img-upload .img-upload__input');
// закрытие поля выбора файла:
var IMG_UPLOAD_CANCEL = document.querySelector('.img-upload .img-upload__cancel');
// форма редактирования изображения:
var IMG_UPLOAD_OVERLAY = document.querySelector('.img-upload .img-upload__overlay');

var onUploadPressEscape = function (evt) {
  if (evt.key === KEY_ESCAPE) {
    closeUploadWindow();
  }
};

// m4t2 Открывает .img-upload__input
var showUploadWindow = function () {
  IMG_UPLOAD_OVERLAY.classList.remove('hidden');
  BODY.classList.add('modal-open');
};

// m4t2 Закрывает .img-upload__input
var closeUploadWindow = function () {
  IMG_UPLOAD_OVERLAY.classList.add('hidden');
  BODY.classList.remove('modal-open');
  IMG_UPLOAD_INPUT = '';

  document.addEventListener('keydown', onUploadPressEscape);
};

IMG_UPLOAD_INPUT.addEventListener('change', function () {
  showUploadWindow();
});

IMG_UPLOAD_CANCEL.addEventListener('click', function () {
  closeUploadWindow();
});

IMG_UPLOAD_CANCEL.addEventListener('keydown', function (evt) {
  if (evt.key === KEY_ENTER) {
    closeUploadWindow();
  }
});

// m4t2-------------Изменение глубины эффекта, накладываемого на изображение:--------

var SLIDER = document.querySelector('.img-upload__effect-level');
var SLIDER_VALUE = SLIDER.querySelector('.effect-level__value');
var SLIDER_LINE = SLIDER.querySelector('.effect-level__line');
var SLIDER_PIN = SLIDER.querySelector('.effect-level__pin');

// рассчитывает эффект по положению pin относительно Line:
var calculateRatio = function () {
  // получаем центр ручки (разделив ширину на 2):
  var pinCenter = SLIDER_PIN.offsetLeft / 2;
  // теперь получаем сдвиг центра ручки от родителя (т.е. линии):
  var pinOffsetCenterX = SLIDER_PIN.offsetLeft + pinCenter;
  // получаем ширину самого слайдера (линии):
  var lineWidth = SLIDER_LINE.offsetWidth;

  // возвращает пропорцию, исходя из положения центра pin относительно Line:
  return Math.floor(pinOffsetCenterX * 100 / lineWidth);
};

// пин слайдера меняет значение value:
SLIDER_PIN.addEventListener('mouseup', function () {
  SLIDER_VALUE.value = calculateRatio();
});

// m4t2-------------Проверка хэштегов на валидацию:--------

var IMG_UPLOAD_FORM = document.querySelector('.img-upload__form');
var HASHTAGS_INPUT = IMG_UPLOAD_FORM.querySelector('.text__hashtags');

HASHTAGS_INPUT.addEventListener('invalid', function () {
  if (HASHTAGS_INPUT.validity.tooShort) {
    HASHTAGS_INPUT.setCustomValidity('Хэштег должен состоять минимум из двух символов');
  } else if (HASHTAGS_INPUT.validity.tooLong) {
    HASHTAGS_INPUT.setCustomValidity('Длина хэштега не должна превышать 50-и символов');
  } else if (HASHTAGS_INPUT.validity.valueMissing) {
    HASHTAGS_INPUT.setCustomValidity('Обязательное поле');
  } else if (HASHTAGS_INPUT.validity.patternMismatch) {
    HASHTAGS_INPUT.setCustomValidity('Хэштег должен соответствовать шаблону (# за которым следуют любые символы)');
  } else {
    HASHTAGS_INPUT.setCustomValidity('');
  }
});
