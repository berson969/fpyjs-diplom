/**
 * Класс PreviewModal.
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal{
  constructor( element ) {
      super(element)
      this.modalPreviewer = document.querySelector(".uploaded-previewer-modal")
      this.registerEvents()
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete.
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    // const modalPreviewer = document.querySelector(".uploaded-previewer-modal")
    this.modalPreviewer.querySelector('.header i').addEventListener('click', () => this.close())

    // buttons-wrapper
    const contentPreview = this.modalPreviewer.querySelector('.content')
    contentPreview.addEventListener('click', (event) => {

      const target = event.target
      const icon = target.querySelector('i')

      if (target.classList.contains('delete') || target.parentElement.classList.contains('delete')) {
        icon.classList.add('icon', 'spinner', 'loading')
        target.closest('.delete').classList.add('disabled')
        const path = target.closest('.delete').dataset.path
        Yandex.removeFile(path, (data) => {

          if (!data) {
            target.closest('.image-preview-container').remove()
            if(!contentPreview.children.length) this.close()
          } else {
            console.error(`Failed to remove file '${path}'`, data)
            icon.classList.remove('spinner', 'loading')
            target.classList.remove('disabled')
          }
        })

      } else if (target.classList.contains('download') || target.parentElement.classList.contains('download')) {
        Yandex.downloadFileByUrl(target.closest('.download').getAttribute('data-file'))
      }
    })
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    const modalContent = this.modalPreviewer.querySelector('.content')

    if (data.items.length) {
      modalContent.innerHTML = data.items.reverse().reduce((total, image) => {
        total += this.getImageInfo(image)
        return total
      }, '')
      // this.registerEvents()
    } else {
      this.close()
    }
  }


  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const formattedDate = new Date(date)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    return formattedDate.toLocaleString('ru-RU', options)

  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
      return `
        <div class="image-preview-container">
          <img src='${item.file}' />
          <table class="ui celled table">
          <thead>
            <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
          </thead>
          <tbody>
            <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${item.size}Кб</td></tr>
          </tbody>
          </table>
          <div class="buttons-wrapper">
            <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
              Удалить
              <i class="trash icon"></i>
            </button>
            <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
              Скачать
              <i class="download icon"></i>
            </button>
          </div>
        </div>`
  }
}
