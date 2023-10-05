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

    // function isImage(href) {
    //   return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest()
    //     xhr.open('HEAD', href, true)
    //     xhr.addEventListener('readystatechange', () => {
    //       if (xhr.readyState === xhr.DONE && xhr.status < 300) {
    //         const contentType = xhr.getResponseHeader('Content-Type')
    //         if (contentType && contentType.startsWith('image/')) {
    //           resolve(true)
    //         } else {
    //           resolve(false)
    //         }
    //       } else {
    //         resolve(false)
    //       }
    //     })
    //     xhr.send()
    //   })
    // }

    console.log('result', result)
    if (result.response) {

      const photosList = result.response.items
      if (photosList && photosList.length > 0) {

      const images = photosList.reduce((array, image) => {

        // const arrayPromises = Promise.all(photosList.map( async (image) => {
        //   return new Promise((resolve) => {


            image.sizes.sort((a, b) => b.type.localeCompare(a.type))
            const href = image.sizes[0].url
            // const answer = Yandex.downloadFileByUrl(href)
            // console.log('answer',answer)
            array.push(href)
            return array

        //     const isImageResult = isImage(href)
        //       console.log('isImage', isImageResult, href)
        //       if (isImageResult) {
        //         resolve(href)
        //       } else {
        //         resolve(null)
        //       }
        //     // })
          }, [])
        // }))


        // Promise.all(arrayPromises)
        //     .then((array) => {
        //       const images = arrayPromises.filter((item) => item !== null)

              console.log('images', images)
              this.lastCallback(images)
              this.lastCallback = () => {}
            // })
      }
    } else if (result.error) {
      alert('Ошибка запроса')
    }
  }
}
