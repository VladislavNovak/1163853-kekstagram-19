// --------------renderPicture.js---------------------------------------------------------
// отрисовывает в .bigPicture указанную фотографию:
'use strict';

(function () {
  // получаем все картинки .picture:
  var smallPictures = document.querySelectorAll('.picture');

  // обрабатываем клик по картинке .picture:
  for (var t = 0; t < smallPictures.length; t++) {
    smallPictures[t].addEventListener('click', function (item) {
      window.bigPicture.draw(item);
    }.bind(null, window.base.collection[t]));
  }
})();
