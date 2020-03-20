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

  //
  var loadComments = function (item) {
    // - в контейнер будем помещать объекты, чтобы избежать лишних перерисовок:
    var fragment = document.createDocumentFragment();
    var localCommentCounter = 0;

    // - заполняет блок пятью комментариями (или меньше, если комментариев больше нет):
    while ((localCommentCounter < COMMENTS_AT_A_TIME) && (globalCommentCounter < item.comments.length)) {
      // - формирует один комментарий:
      var comment = processOneComment(item.comments[globalCommentCounter]);
      // - заполняет временный фрагмент:
      fragment.appendChild(comment);

      globalCommentCounter++;
      localCommentCounter++;
    }

    if (globalCommentCounter < item.comments.length) {
      commentsLoaderButton.classList.remove('hidden');
      commentsLoaderButton.addEventListener('click', function () {
        loadComments(item);
      });
    } else {
      commentsLoaderButton.classList.add('hidden');
    }

    // - устанавливаем нумерацию в заголовке (сколько/из):
    setNumerationComments(item.comments.length);

    // // - удаляем дефолтные сообщения (в разметке):
    // socialCommentsList.innerHTML = '';

    // var defaultSocialComments = socialCommentsList.queryselectorAll('.social__comment');
    // defaultSocialComments.forEach(function (element) {
    //   element.remove();
    // });

    // - добавляем новые:
    socialCommentsList.appendChild(fragment);
  };

  // ---------- Заполняет .big-picture: url, описание, количество лайков: ----------

  var draw = function (item) {
    // - заполняем путь, лайки, кол.комментариев, описание:
    pathToPhoto.src = item.url;
    socialCountOfLikes.textContent = item.likes;
    socialCaption.textContent = item.description;

    // - загружаем пять комментариев (или меньше):
    if (isFirstLoad) {
      loadComments(item);
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

    // m4t2 Закрывает окно .big-picture и разрешает прокрутку фона:
    var closeBigPicture = function () {
      picture.classList.add('hidden');
      body.classList.remove('modal-open');
    };

    pictureCancel.addEventListener('click', function () {
      closeBigPicture();
    });

    pictureCancel.addEventListener('keydown', function (evt) {
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

  // --------- Глобальная область: ----------------
  window.representation = {
    draw: draw,
  };
})();
