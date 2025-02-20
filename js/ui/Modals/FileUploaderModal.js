/**
 * Класс FileUploaderModal.
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element)
    this.modalUploader = document.querySelector(".file-uploader-modal")
    this.registerEvents()
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){

    this.modalUploader.addEventListener('click', (event) => {

      const target = event.target
      if (target.classList.contains('icon') || target.classList.contains('close')) {
        this.close()

      } else if (target.classList.contains('send-all')) { this.sendAllImages()

      } else if (target.tagName === 'INPUT') {
        target.parentElement.classList.remove('.error')

      } else if (target.closest('button.button')) {
        const container = target.closest('.image-preview-container')
        this.sendImage(container)
      }

    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    const modalContent = this.modalUploader.querySelector('.content')

    modalContent.innerHTML = images.reverse().reduce((total, image) => {
      total += this.getImageHTML(image)
      return total
    }, '')
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
        <div class="image-preview-container">
            <img src='${item}' />
            <div class="ui action input">
              <input type="text" placeholder="Путь и имя файла">
              <button class="ui button"><i class="upload icon"></i></button>
            </div>
        </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const containers = document.body.querySelectorAll(".image-preview-container")
    containers.forEach(container => this.sendImage(container))
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const input = imageContainer.querySelector('input')
    const url = imageContainer.querySelector('img')

    if(input && input.value.trim()) {

      input.classList.add("disabled")
      Yandex.uploadFile(input.value.trim(), url.src, () => {

        if (this.modalUploader.querySelectorAll('input').length === 1) this.close()
        imageContainer.remove()
      })

    } else {

      input.parentElement.classList.add("error")
    }

  }
}