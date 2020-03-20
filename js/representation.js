// --------------representation.js---------------------------------------------------------
// Полноэкранный показ изображения .big-picture:
'use strict';

(function () {
  var body = document.body;
  var KEY_ESCAPE = 'Escape';
  var KEY_ENTER = 'Enter';
  var isFocusInputSocialFooterText = false;

  var isFirstLoad = true;
  var COMMENTS_AT_A_TIME = 5; // количество комментариев при показе за раз
  var globalCommentCounter = 0; // глобальный счётчик комментариев
  var globalData;

  var picture = document.querySelector('.big-picture');
  // m4t2 кнопка/событие закрытия .big-picture:
  var pictureCancel = picture.querySelector('.big-picture__cancel');
  var pathToPhoto = picture.querySelector('.big-picture__img').querySelector('img');
  var socialCountOfLikes = picture.querySelector('.big-picture__social').querySelector('.likes-count');
  var socialCaption = picture.querySelector('.big-picture__social').querySelector('.social__caption');
  var divCommentCount = picture.querySelector('.social__comment-count');
  var spanCommentsCount = divCommentCount.querySelector('.comments-count');
  var socialCommentsList = picture.querySelector('.social__comments');
  var inputSocialFooterText = picture.querySelector('.social__footer-text');
  // кнопка загрузки новых фото:
  var commentsLoaderButton = picture.querySelector('.comments-loader');

  // Формирует один комментарий:
  var processOneComment = function (comment) {
    var socialComment = socialCommentsList.querySelector('.social__comment').cloneNode(true);
    var avatar = socialComment.querySelector('.social__picture');
    var text = socialComment.querySelector('.social__text');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    text.textContent = comment.message;

    return socialComment;
  };

  // Формируем нажпись о количестве загруженных комментариев:
  var setNumerationComments = function (totalAmountOfComments) {
    divCommentCount.innerHTML = globalCommentCounter + ' из ';
    spanCommentsCount.textContent = totalAmountOfComments;
    divCommentCount.appendChild(spanCommentsCount);
    var text = document.createTextNode(' комментариев');
    divCommentCount.appendChild(text);
  };

  var onCommentsLoaderButtonClick = function () {
    var nextFragment = unLoadComments(globalData);

    // - добавляем новые:
    socialCommentsList.appendChild(nextFragment);
  };

  // Выгружает COMMENTS_AT_A_TIME комментариев:
  var unLoadComments = function (item) {
    // - в контейнер будем помещать объекты, чтобы избежать лишних перерисовок:
    var fragment = document.createDocumentFragment();
    // - локальный счётчик сформированных комментариев:
    var localCommentCounter = 0;

    // - заполняет блок COMMENTS_AT_A_TIME комментариями (или меньше, если комментариев больше нет):
    while ((localCommentCounter < COMMENTS_AT_A_TIME) && (globalCommentCounter < item.comments.length)) {
      // - формирует один комментарий:
      var comment = processOneComment(item.comments[globalCommentCounter]);
      // - заполняет временный фрагмент:
      fragment.appendChild(comment);
      // - увеличиваем счётчики:
      globalCommentCounter++;
      localCommentCounter++;
    }

    // - если ещё есть незагруженные комментарии:
    if (globalCommentCounter < item.comments.length) {
      // - то возможно ещё загрузить следующий блок:
      commentsLoaderButton.addEventListener('click', onCommentsLoaderButtonClick);
    } else {
      // - а иначе скрываем кнопку загрузки комментариев:
      commentsLoaderButton.classList.add('hidden');
    }

    // - устанавливаем нумерацию в заголовке (сколько/из):
    setNumerationComments(item.comments.length);

    return fragment;
  };

  // ---------- Заполняет .big-picture: url, описание, количество лайков: ----------

  var draw = function (data) {
    // - сохраняем данные для того, чтобы впоследствии воспользоваться при клике:
    globalData = data;
    // - заполняем путь, лайки, кол.комментариев, описание:
    pathToPhoto.src = data.url;
    socialCountOfLikes.textContent = data.likes;
    socialCaption.textContent = data.description;

    // - если это первое открытие окна, то:
    if (isFirstLoad) {
      // - открываем кнопку загрузки новых комментариев:
      commentsLoaderButton.classList.remove('hidden');

      // - выгружаем пять комментариев (или меньше):
      var fragment = unLoadComments(data);

      // - находим в DOM дефолтные сообщения:
      var defaultSocialComments = socialCommentsList.querySelectorAll('.social__comment');
      defaultSocialComments.forEach(function (element) {
        // - и удаляем их:
        element.remove();
      });

      // - теперь в DOM добавляем новые:
      socialCommentsList.appendChild(fragment);

      // - сигнализируем, что больше этот блок кода не потребуется:
      isFirstLoad = false;
    }

    // - показываем блок .big-picture
    picture.classList.remove('hidden');
    // контейнер с фотографиями позади не должен прокручиваться при скролле:
    body.classList.add('modal-open');

    // -------- Обработка нажатия клавиш в контексте функции draw: ------------

    var onBigPicturePressEscape = function (evt) {
      if (evt.key === KEY_ESCAPE && !isFocusInputSocialFooterText) {
        closeBigPicture();
      }
    };

    document.addEventListener('keydown', onBigPicturePressEscape);

    // Закрывает окно .big-picture и разрешает прокрутку фона:
    var closeBigPicture = function () {
      picture.classList.add('hidden');
      body.classList.remove('modal-open');
      // - обнуляем счётчик комментариев:
      globalCommentCounter = 0;
      // - сигнализируем, что всё готово для нового открытия окна:
      isFirstLoad = true;
    };

    pictureCancel.addEventListener('click', function () {
      closeBigPicture();
    });

    pictureCancel.addEventListener('keydown', function (evt) {
      if (evt.key === KEY_ENTER) {
        closeBigPicture();
      }
    });

    // При клике на инпуте:
    inputSocialFooterText.addEventListener('focus', function () {
      // - устанавливаем флаг:
      isFocusInputSocialFooterText = true;
    });

    // При клике на инпуте:
    inputSocialFooterText.addEventListener('blur', function () {
      // - флаг снят:
      isFocusInputSocialFooterText = false;
    });
  };

  // --------- Глобальная область: ----------------
  window.representation = {
    draw: draw,
  };
})();
