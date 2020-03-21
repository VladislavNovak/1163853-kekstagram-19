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

  // создаёт кроссбраузерный вариант запроса:
  var createRequest = function () {
    var request = false;
    request = new XMLHttpRequest();
    request.responseType = 'json';
    if (request.overrideMimeType) {
      request.overrideMimeType('text/xml');
    }

    return request;
  };

  // ----------------- Получение данных с сервера: ---------------
  var load = function (onError, onSuccess) {
    var WHEREFROM = 'https://js.dump.academy/kekstagram/data';
    // создаём запрос:
    var request = createRequest();
    // и проверяем ещё раз:
    if (!request) {
      // return false;
      onError('Невозможно создать XMLHttpRequest');
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

          // в любых других случаях:
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
    request.open('GET', WHEREFROM);
    request.send();
  };

  // ----------------- Отправка данных на сервер: -----------------

  var save = function (data, onError, onSuccess) {
    // адрес сервера, на который должны отправиться данные:
    var URLTOSAVE = 'https://js.dump.academy/kekstagram';

    // создаём запрос:
    var request = createRequest();
    // и проверяем ещё раз:
    if (!request) {
      // return false;
      onError('Невозможно создать XMLHttpRequest');
    }

    request.addEventListener('load', function () {
      if (request.status === StatusCode.OK) {
        onSuccess(request.response);
      } else {
        onError('Статус ответа: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    request.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + request.timeout + 'мс');
    });

    request.open('POST', URLTOSAVE);
    // data — объект FormData, который содержит данные формы, которые будут отправлены на сервер:
    request.send(data);
  };

  // Добавляем функции отправки/загрузки данных в глобальном объекте:
  window.backend = {
    load: load,
    save: save,
  };
})();
