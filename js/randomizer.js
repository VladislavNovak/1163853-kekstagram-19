// ------------randomizer.js---------------------------------------------------------------
// Обслуживающие функции
'use strict';

(function () {
  var getRandNumber = function (minimum, maximum) {
    var rand = minimum + Math.random() * (maximum - minimum);

    return Math.floor(rand);
  };

  var getRandomItem = function (array) {
    var item = array[getRandNumber(0, array.length)];

    return item;
  };

  window.randomizer = {
    getNumber: getRandNumber,
    getItem: getRandomItem,
  };
})();
