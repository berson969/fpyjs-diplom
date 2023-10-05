/**
 * Класс SearchBlock.
 * Используется для взаимодействия со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    if (element) {
      this.element = element
      this.registerEvents()
    } else {
      throw new Error()
    }

  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить".
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    this.element.addEventListener('click', (event) => {
      const input = this.element.querySelector('input').value.trim()

      if (input) {
        if (event.target.classList.contains('replace')) {
          App.imageViewer.clear()
          VK.get(input, App.imageViewer.drawImages)

        } else if (event.target.classList.contains('add')) {
          VK.get(input, App.imageViewer.drawImages)
        }
      }
    })
  }

}