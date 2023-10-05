/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN
  static lastCallback

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    this.lastCallback = callback

    this.ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN')
    if (!this.ACCESS_TOKEN) {
      this.ACCESS_TOKEN = prompt('Введите токен VK')
      localStorage.setItem('ACCESS_TOKEN', this.ACCESS_TOKEN)
    }

    const script = document.createElement('script')
    script.id = 'script'
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}
      &album_id=profile&rev=0&extended=1&photo_sizes=1&count=10
      &callback=VK.processData&access_token=${VK.ACCESS_TOKEN}&v=5.154`


    document.getElementsByTagName('body')[0].insertAdjacentElement('beforeend', script)
  }


  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    document.getElementById('script').remove()

    if (result.response) {

      const photosList = result.response.items
      if (photosList && photosList.length > 0) {

      const images = photosList.reduce((array, image) => {

        image.sizes.sort((a, b) => b.type.localeCompare(a.type))
        array.push(image.sizes[0].url)
        return array
      }, [])

      this.lastCallback(images)
      this.lastCallback = () => {}
      }
    } else if (result.error) {
      alert('Ошибка запроса')
    }
  }
}
