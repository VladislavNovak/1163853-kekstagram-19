// --------------backend.js---------------------------------------------------------
// Модуль для работы с удалённым сервером:

'use strict';

(function () {
  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    IM_A_TEAPOT: 418,
  };
  var TIMEOUT_IN_MS = 10000; // 10 ms

  // создаёт кроссбраузерный вариант запроса:
  var createRequest = function () {
    var request = false;
    request = new XMLHttpRequest();
    request.responseType = 'json';
    if (request.overrideMimeType) {
      request.overrideMimeType('text/xml');
    }

    if (!request) {
      return false;
    }

    return request;
  };

  var load = function (onSuccess, onError) {
    // var whereFrom = 'https://js.dump.academy/kekstagram/data';
    var whereFrom = 'https://js.dump.academy/kekstagram/data';
    // создаём запрос:
    var request = createRequest();
    // и проверяем ещё раз:
    if (!request) {
      // return false;
      onError('Ошибка. Невозможно создать XMLHttpRequest');
    }

    request.addEventListener('load', function () {
      switch (request.status) {
        case StatusCode.OK:
          // onSuccess срабатывает при успешном выполнении запроса
          onSuccess(request.response);
          break;

        case StatusCode.BAD_REQUEST:
          // onError срабатывают при неуспешном выполнении запроса
          onError('Неверный запрос (Bad Request)');
          break;

        case StatusCode.NOT_FOUND:
          onError('Не найдено (Not Found)');
          break;

        case StatusCode.IM_A_TEAPOT:
          onError('Я - чайник (I’m a teapot)');
          break;

        default:
          onError('Статус ответа: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    request.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + request.timeout + 'мс');
    });

    request.timeout = TIMEOUT_IN_MS;
    request.open('GET', whereFrom);
    request.send();
  };

  window.backend = {
    load: load,
  };
})();
