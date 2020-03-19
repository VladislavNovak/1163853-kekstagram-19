// -----------------sort.js--------------------------------------------------------
// Фильтры, управляющие порядком сортировки фотографий:----------
'use strict';

(function () {
  var action = function () {
    var TOTAL_PHOTOS = 10;
    var sortingBlock = document.querySelector('.img-filters');
    var sortingButtons = sortingBlock.querySelectorAll('.img-filters__button');
    var pictures = document.querySelector('.pictures');

    // - и показываем блок .img-filters:
    sortingBlock.classList.remove('img-filters--inactive');

    // в debounce исключаем многократное нажатие баттона:
    var onSortingButtonsClick = window.debounce(function (evt) {
      // если нажатая клавиша фильтра не содержит 'активный' класс...
      if (!evt.target.classList.contains('img-filters__button--active')) {
        // - значит - ещё активен прежняя кнопка сортировки...
        var oldSortButton = sortingBlock.querySelector('.img-filters__button--active');
        // - поэтому, из старого удаляем 'активный' класс...
        oldSortButton.classList.remove('img-filters__button--active');
        // - а в актуальный добавляем:
        evt.target.classList.add('img-filters__button--active');

        // - очищает весь блок с результатом прежней сортировки:
        pictures.innerHTML = '';

        // - копирует данные для того, чтобы не изменились основные данные:
        var data = window.serverData.slice();

        // возвращает десять случайных неповторяющихся фото:
        var getTenRandomElement = function (originData) {
          // - копия оригинального массива:
          var copyData = originData.slice();
          // - получает случайно перемешанный массив:
          var mixedData = copyData.sort(function () {
            return Math.random() - 0.5;
          });

          var result = [];
          // - удаляет из массива повторяющиеся значения:
          mixedData.forEach(function (element) {
            if (!result.includes(element)) {
              result.push(element);
            }
          });

          // - возвращает десять объектов:
          return result.slice(0, TOTAL_PHOTOS);
        };

        // сортируем в зависимости от выбранной кнопки:
        switch (evt.target.id) {
          // - 10 случайных, не повторяющихся фотографий:
          case 'filter-random':
            data = getTenRandomElement(data);
            break;
          // - фотографии, отсортированные в порядке убывания количества комментариев:
          case 'filter-discussed':
            data = data.sort(function (a, b) {
              return b.comments.length - a.comments.length;
            });
        }

        window.base.renderData(data);
      }
    });

    sortingButtons.forEach(function (item) {
      item.addEventListener('click', onSortingButtonsClick);
    });
  };

  // --------- Глобальная область: ----------------
  window.sort = {
    action: action,
  };
})();
