// --------------backend.js---------------------------------------------------------
// Модуль для работы с удалённым сервером:

'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000; // 10 ms

  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    IM_A_TEAPOT: 418,
  };

  var request = function (onError, onSuccess, method, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/xml');
    }

    if (!xhr) {
      onError('Невозможно создать XMLHttpRequest');
    }

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.OK:
          // onSuccess срабатывает при успешном выполнении запроса
          onSuccess(xhr.response);
          break;

        case StatusCode.BAD_REQUEST:
          // onError срабатывают при неуспешном выполнении запроса
          onError('Неверный запрос (Bad XMLHttpReques)');
          break;

        case StatusCode.NOT_FOUND:
          onError('Не найдено (Not Found)');
          break;

        case StatusCode.IM_A_TEAPOT:
          onError('Я - чайник (I’m a teapot)');
          break;

          // в любых других случаях:
        default:
          onError('Ошибка! Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(method, url);

    // если аргументов пять, значит отправляем на сервер, четыре - получаем с сервера:
    if (arguments.length === 5) {
      // data — объект FormData, который содержит данные формы, которые будут отправлены на сервер:
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  // Добавляем функции отправки/загрузки данных в глобальном объекте:
  window.backend = {
    request: request,
    // адрес сервера, с которого должны поучить данные:
    WHEREFROM: 'https://js.dump.academy/kekstagram/data',
    // адрес сервера, на который должны отправиться данные:
    URLTOSAVE: 'https://js.dump.academy/kekstagram',
    GET_METHOD: 'GET',
    POST_METOD: 'POST',
  };
})();
