// --------------bigPicture.js---------------------------------------------------------
// Полноэкранный показ изображения .big-picture:
'use strict';

(function () {
  var picture = document.querySelector('.big-picture');
  // m4t2 кнопка/событие закрытия .big-picture:
  var pictureCancel = picture.querySelector('.big-picture__cancel');
  var pathToPhoto = picture.querySelector('.big-picture__img').querySelector('img');
  var socialLikes = picture.querySelector('.big-picture__social').querySelector('.social__likes');
  var socialCaption = picture.querySelector('.big-picture__social').querySelector('.social__caption');
  var commentsCount = picture.querySelector('.social__comment-count').querySelector('.comments-count');
  var socialCommentsList = picture.querySelector('.social__comments');
  var inputSocialFooterText = picture.querySelector('.social__footer-text');
  // var commentsLoader = picture.querySelector('.comments-loader');

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
    picture.classList.remove('hidden');

    // Скрываем блок счётчика комментариев и блок загрузки новых комментариев:
    var socialcommentCount = picture.querySelector('.social__comment-count');
    var commentsLoader = picture.querySelector('.comments-loader');
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

  window.bigPicture = {
    draw: drawBigPictures,
  };
})();
