/**
 * Класс ImageViewer.
 * Используется для взаимодействия с блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    if (element) {
      this.element = element
      this.blockImages = this.element.querySelector('.images-list .grid .row')
      this.selectAllBtn = this.element.getElementsByClassName('select-all')[0]
      this.registerEvents()
    } else {
      throw new Error()
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

      if (event.target.tagName === 'IMG') {
        event.target.classList.toggle('selected')
        this.checkButtonText()
      }
    })

    this.selectAllBtn.addEventListener('click', (event) => {
      const images = document.querySelectorAll('.images-list img')
      const allSelected = Array.from(images).every(image => image.classList.contains('selected'))

      images.forEach(image => {
        image.classList.toggle('selected', !allSelected)
      })
      this.checkButtonText()
    })

    document.body.querySelector('.show-uploaded-files').addEventListener('click', (event) => {
      const modalPreviewer = App.getModal('filePreviewer')

      document.querySelector(".uploaded-previewer-modal .content")
          .innerHTML = '<i class="asterisk loading icon massive"></i>'
      modalPreviewer.open()

      Yandex.getUploadedFiles(data => {
        modalPreviewer.showImages(data)
      })
    })

    document.body.querySelector('.send').addEventListener('click', () => {
      const modalUploader = App.getModal('fileUploader')

      const selectedImages = this.blockImages.querySelectorAll('.selected')
      const imageLinks = Array.from(selectedImages).map(image => image.src)
      modalUploader.showImages(imageLinks)
      modalUploader.open()
      selectedImages.forEach(image => image.classList.remove('selected'))
      this.checkButtonText()
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.blockImages.innerHTML = ''
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {

    if(images && images.length) {
      document.body.getElementsByClassName('select-all')[0].classList.remove('disabled')
      images.forEach(href => {
        if (!isImage(href)) {
          const imageElement = document.createElement('div')
          imageElement.classList.add('four', 'wide', 'column', 'medium')
          imageElement.innerHTML = `<img src='${href}'</img>`
          document.querySelector('.images-list .row').appendChild(imageElement)
        }
      })
    } else {
      document.body.getElementsByClassName('select-all')[0].classList.remove('disabled')
    }

    function isImage(href) {
      const xhr = new XMLHttpRequest()
      xhr.open('HEAD', href, false)
      xhr.send()
      return xhr.status === 404
    }
  }

  /**
   * Контролирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {

    const sendBtn = document.body.getElementsByClassName('send')[0]
    const images = this.blockImages.querySelectorAll('img')
    const anyImageSelected = Array.from(images).some(image => image.classList.contains('selected'))
    const allImagesSelected = Array.from(images).every(image => image.classList.contains('selected'))

    sendBtn.classList.toggle('disabled', !anyImageSelected)
    this.selectAllBtn.textContent = allImagesSelected ? 'Снять выделение' : 'Выбрать всё'
  }

}