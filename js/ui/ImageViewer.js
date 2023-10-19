/**
 * Класс ImageViewer.
 * Используется для взаимодействия с блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    if (element) {
      this.element = element
      this.blockImages = this.element.querySelector('.images-list')
      console.log("111", this.blockImages)
      this.registerEvents()
    } else {
      throw new Error('Element is not provided in ImageViewer constructor')
    }
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности.
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){

    this.blockImages.addEventListener('dblclick', (event) => {
      if (event.target.tagName === 'IMG') {
        this.element.querySelector('img.image')
            .setAttribute('src',event.target.getAttribute('src'))
      }
    })

    this.blockImages.addEventListener('click', (event) => {

      const target = event.target
      console.log('target', target)

      if (target.tagName === 'IMG') {
        target.classList.toggle('selected')
        this.checkButtonText()

      } else if (target.classList.contains('select-all')) {
        const images = this.blockImages.querySelectorAll('.images-list img')
        const allSelected = Array.from(images).every(image => image.classList.contains('selected'))
        images.forEach(image => {
          image.classList.toggle('selected', !allSelected)
          this.checkButtonText()
        })

      } else if (target.classList.contains('show-uploaded-files')) {
        const modalPreviewer = App.getModal('filePreviewer')
        modalPreviewer.innerHTML = '<i class="asterisk loading icon massive"></i>'
        modalPreviewer.open()

        Yandex.getUploadedFiles(data => {
          modalPreviewer.showImages(data)
        })

      } else if (target.classList.contains('send')) {

        const modalUploader = App.getModal('fileUploader')
        const selectedImages = this.blockImages.querySelectorAll('.selected')
        const imageLinks = Array.from(selectedImages).map(image => image.src)
        modalUploader.showImages(imageLinks)
        modalUploader.open()
        selectedImages.forEach(image => image.classList.remove('selected'))
        this.checkButtonText()
      }
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.blockImages.innerHTML = `
        <div class="ui grid">
            <div class="row"></div>
            <div class="row">
              <button class="ui disabled primary button select-all">Выбрать всё</button>
              <button class="ui primary button show-uploaded-files">Посмотреть загруженные файлы</button>
              <button class="ui primary disabled button send">Отправить на диск</button>
            </div>
        </div>`
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {

    if (images && images.length) {

      images.forEach(href => {
        isImage(href).then(isImg => {
              if(isImg) {
                const imageElement = document.createElement('div')
                imageElement.classList.add('four', 'wide', 'column', 'medium')
                imageElement.innerHTML = `<img src='${href}'</img>`
                document.querySelector('.images-list .row').appendChild(imageElement)
                // this.blockImages.querySelector('.row').appendChild(imageElement)
              }
            })
      })
    }
    // this.blockImages.querySelector('.select-all').classList.remove('disabled')
    document.body.getElementsByClassName('select-all')[0].classList.remove('disabled')

    function isImage(href) {
      return fetch(href, {
        method: "HEAD",
      })
          .then(response => {
            return response.ok;
          })
          .catch(error => {
            console.error(error)
            return false
          })
    }
  }

    //   const xhr = new XMLHttpRequest()
    //   xhr.open('HEAD', href, false)
    //   xhr.send()
    //   return xhr.status === 404
    // }
  // }

  /**
   * Контролирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {

    const images = this.blockImages.querySelectorAll('.four img')
    const anyImageSelected = Array.from(images).some(image => image.classList.contains('selected'))
    const allImagesSelected = Array.from(images).every(image => image.classList.contains('selected'))

    this.blockImages.querySelector(".send").classList.toggle('disabled', !anyImageSelected)
    this.blockImages.querySelector('.select-all').textContent = allImagesSelected ? 'Снять выделение' : 'Выбрать всё'
  }

}