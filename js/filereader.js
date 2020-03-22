// -----------------filereader.js---------------------------------------------
// реализовывает загрузку фотографии пользователя:

'use strict';

(function () {
  // допустимые расширения для файла:
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var imgUpload = document.querySelector('.img-upload');
  // картинка куда мы будем выставлять загруженное изображение:
  var preview = imgUpload.querySelector('.img-upload__preview').querySelector('img');

  var showPreview = function (evt) {
    // зачитываем имя файла:
    // var file = evt.target.file[0];
    var file = evt.target.files[0];
    var fileName = evt.target.value.toLowerCase();

    // возвращаем true, если заканчивается допустимым расширением (или false, в противном случае):
    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    // если имя допустимо:
    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        // после прочтения подменяет картинке пользователя атрибут src:
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  window.filereader = {
    showPreview: showPreview,
  };
})();
