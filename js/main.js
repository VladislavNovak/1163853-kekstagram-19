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

// ------------------------------------------------------------------------------------
// ------------Обслуживающие функции---------------------------------------------------

var getRandNumber = function (minimum, maximum) {
  var rand = minimum + Math.random() * (maximum - minimum);

  return Math.floor(rand);
};

var getRandomItem = function (array) {
  var item = array[getRandNumber(0, array.length)];

  return item;
};

// Склейка нескольких посланий:
var collectComments = function (messages) {
  var message1 = getRandomItem(messages);
  var message2 = getRandomItem(messages);
  while (message1 === message2) {
    message2 = getRandomItem(messages);
  }
  message1 += ' ' + message2;

  return message1;
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

// ------------------------------------------------------------------------------------
// --------------Полноэкранный показ изображения .big-picture--------------------------

var bigPicture = document.querySelector('.big-picture');
// m4t2 кнопка/событие закрытия .big-picture:
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
var pathToPhoto = bigPicture.querySelector('.big-picture__img').querySelector('img');
var socialLikes = bigPicture.querySelector('.big-picture__social').querySelector('.social__likes');
var socialCaption = bigPicture.querySelector('.big-picture__social').querySelector('.social__caption');
var commentsCount = bigPicture.querySelector('.social__comment-count').querySelector('.comments-count');
var socialCommentsList = bigPicture.querySelector('.social__comments');
var inputSocialFooterText = bigPicture.querySelector('.social__footer-text');

var body = document.body;
var KEY_ESCAPE = 'Escape';
var KEY_ENTER = 'Enter';
var isFocusInputSocialFooterText = false;

// Заполняет .big-picture комментариями:
var processOneComment = function (comment) {
  var socialComment = socialCommentsList.querySelector('.social__comment').cloneNode(true);
  var avatar = socialComment.querySelector('.social__picture');
  var text = socialComment.querySelector('.social__text');

  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  text.textContent = comment.message;

  return socialComment;
};

// Заполняет .big-picture: url, описание, количество лайков:
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

  // показываем блок .big-picture
  bigPicture.classList.remove('hidden');

  // Скрываем блок счётчика комментариев и блок загрузки новых комментариев:
  var socialcommentCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  socialcommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // контейнер с фотографиями позади не должен прокручиваться при скролле:
  body.classList.add('modal-open');

  var onBigPicturePressEscape = function (evt) {
    if (evt.key === KEY_ESCAPE && !isFocusInputSocialFooterText) {
      closeBigPicture();
    }
  };

  document.addEventListener('keydown', onBigPicturePressEscape);

  // m4t2 Закрывает окно .big-picture и разрешает прокрутку фона:
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

  bigPictureCancel.addEventListener('keydown', function (evt) {
    if (evt.key === KEY_ENTER) {
      closeBigPicture();
    }
  });

  // m4t3 на инпуте стоит фокус
  inputSocialFooterText.addEventListener('focus', function () {
    isFocusInputSocialFooterText = true;
  });

  // m4t3 с инпута фокус снят
  inputSocialFooterText.addEventListener('blur', function () {
    isFocusInputSocialFooterText = false;
  });
};

// -----------------------------------------------------------------------------------------
// m4t3----------отрисовывает в .bigPicture указаннуюю фотографию:--------------------------

// получаем все картинки .picture:
var smallPictures = document.querySelectorAll('.picture');

// обрабатываем клик по картинке .picture:
for (var t = 0; t < smallPictures.length; t++) {
  smallPictures[t].addEventListener('click', function (item) {
    drawBigPictures(item);
  }.bind(null, collection[t]));
}

// ------------------------------------------------------------------------------------
// m4t2----------поле для загрузки изображения .upload-file:---------------------------

// поле выбора файла:
var imgUploadInput = document.querySelector('.img-upload .img-upload__input');
// закрытие поля выбора файла:
var imgUploadCancel = document.querySelector('.img-upload .img-upload__cancel');
// форма редактирования изображения:
var imgUploadOverlay = document.querySelector('.img-upload .img-upload__overlay');

var onUploadPressEscape = function (evt) {
  if (evt.key === KEY_ESCAPE) {
    closeUploadWindow();
  }
};

document.addEventListener('keydown', onUploadPressEscape);

// m4t2 Открывает .img-upload__input
var showUploadWindow = function () {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
};

// m4t2 Закрывает .img-upload__input
var closeUploadWindow = function () {
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  imgUploadInput = '';
};

imgUploadInput.addEventListener('change', function () {
  showUploadWindow();
});

// закрытие через click:
imgUploadCancel.addEventListener('click', function () {
  closeUploadWindow();
});

// если фокус на .img-upload__cancel, закрытие возможно через enter:
imgUploadCancel.addEventListener('keydown', function (evt) {
  if (evt.key === KEY_ENTER) {
    closeUploadWindow();
  }
});

// ------------------------------------------------------------------------------------
// m4t2-------------Изменение глубины эффекта, накладываемого на изображение:----------

var slider = document.querySelector('.img-upload__effect-level');
var sliderValue = slider.querySelector('.effect-level__value');
var sliderLine = slider.querySelector('.effect-level__line');
var sliderPin = slider.querySelector('.effect-level__pin');

// рассчитывает эффект по положению pin относительно Line:
var calculateRatio = function () {
  // получаем центр ручки (разделив ширину на 2):
  var pinCenter = sliderPin.offsetLeft / 2;
  // теперь получаем сдвиг центра ручки от родителя (т.е. линии):
  var pinOffsetCenterX = sliderPin.offsetLeft + pinCenter;
  // получаем ширину самого слайдера (линии):
  var lineWidth = sliderLine.offsetWidth;

  // возвращает пропорцию, исходя из положения центра pin относительно Line:
  return Math.floor(pinOffsetCenterX * 100 / lineWidth);
};

// пин слайдера меняет значение value:
sliderPin.addEventListener('mouseup', function () {
  sliderValue.value = calculateRatio();
});

// ------------------------------------------------------------------------------------
// m4t2-------------Наложение эффекта на изображение:----------------------------------

var uploadForm = document.querySelector('.img-upload__form');
var imgUploadPreview = uploadForm.querySelector('.img-upload__preview').querySelector('img');
var radios = uploadForm.querySelectorAll('.effects__radio');
// первый радиобаттон. Нужен, чтобы изначально отключить слайдер
var ORIGIN = 0;

if (radios[ORIGIN].checked) {
  slider.classList.add('hidden');
}

// если радиобаттон isChecked, то...
var onRadioClick = function (evt) {
  if (evt.target.checked) {
    // обнуляем уже добавленные классы;
    imgUploadPreview.className = '';
    // добавляем картинке класс (составляем из названия в CSS и радиобаттон.value):
    imgUploadPreview.classList.add('effects__preview--' + evt.target.value);
    // при переключении эффектов, уровень насыщенности сбрасывается до начального значения (100%):
    sliderValue.value = 100;
    // если выбран радиобаттон ORIGIN, то слайдер прячется
    if (imgUploadPreview.classList.contains('effects__preview--none')) {
      slider.classList.add('hidden');
    } else {
      slider.classList.remove('hidden');
    }
  }
};

// обрабатывает клик на каждом радиобаттоне .effects__radio:
for (var a = 0; a < radios.length; a++) {
  radios[a].addEventListener('click', onRadioClick);
}

// ------------------------------------------------------------------------------------
// m4t2-------------Проверка хэштегов на валидацию:------------------------------------

var hashtagsInput = uploadForm.querySelector('.text__hashtags');
var imgUploadSubmit = uploadForm.querySelector('.img-upload__submit');
var textDescription = uploadForm.querySelector('.text__description');
// максимальное количество хэштегов:
var MAX_QUANTITY_HASHTAGS = 5;
var stopSubmit = false;

hashtagsInput.addEventListener('input', function (evt) {
  // вызывающий объект (this):
  var target = evt.target;
  target.setCustomValidity('');
  stopSubmit = false;

  // регулярные выражения:
  var divider = /\s+/;
  var pattern = /^#([A-Za-z0-9А-Яа-я]{2,19})$/;
  // формируем массив, удаляя боковые пробелы, разделяя по внутренним пробелам:
  var hashTags = target.value.trim().split(divider);

  // проверяем количество введённых тегов:
  if (hashTags.length > MAX_QUANTITY_HASHTAGS) {
    stopSubmit = true;
    target.setCustomValidity('Максимальное количество тегов: ' + MAX_QUANTITY_HASHTAGS + ' превышено');
  }

  // проверяем по соответствию шаблону ^#([A-Za-z0-9А-Яа-я]{2,19})$:
  for (var i = 0; i < hashTags.length; i++) {
    var hashTag = hashTags[i];
    if (!pattern.test(hashTag)) {
      stopSubmit = true;
      target.setCustomValidity('Хэштег "' + hashTag + '" должен соответствовать шаблону: # за которым следуют любые не специальные символы (от двух до 20-и) без пробелов)');
    }
  }

  // сортируем и проверяем совпадение хэштегов:
  var sortedHashTags = hashTags.slice().sort();
  for (var j = 0; j < hashTags.length - 1; j++) {
    if (sortedHashTags[j] === sortedHashTags[j + 1]) {
      stopSubmit = true;
      target.setCustomValidity('Необходимо удалить хэштег ' + sortedHashTags[j] + ' т.к. он уже используется!');
    }
  }
});

// если хотя бы одна проверка не пройдена, прервать отправление формы:
imgUploadSubmit.addEventListener('submit', function (evt) {
  if (stopSubmit) {
    evt.preventDefault();
    return;
  }
});

// длина комментария не может составлять больше 140 символов:
textDescription.addEventListener('invalid', function () {
  if (textDescription.validity.tooLong) {
    textDescription.setCustomValidity('Длина комментария не может составлять больше 140 символов!');
  } else {
    textDescription.setCustomValidity('');
  }
});
