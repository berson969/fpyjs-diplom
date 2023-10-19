/**
 * Класс Yandex.
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';
  static HEADERS = {
    "Authorization": `OAuth ${this.getToken()}`,
    'Content-Type': 'application/json',
  }
  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    let token = localStorage.getItem('YANDEX_TOKEN')
    if (!token) {
      token= prompt('Введите токен Yandex')
      localStorage.setItem('YANDEX_TOKEN', token)
    }
    return token
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: 'POST',
      url: this.HOST + '/resources/upload',
      data: {'path': path, 'url': url},
      headers: this.HEADERS,
    }, callback)
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    createRequest({
      method: 'DELETE',
      url: this.HOST + '/resources',
      data: {'path': path},
      headers: this.HEADERS,
    }, callback)
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    createRequest({
      method: 'GET',
      url: this.HOST + '/resources/files',
      headers: this.HEADERS,
      data: {media_type: 'image', type: 'file'},
    }, callback)
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a')
    link.href = url
    link.click()
  }
}
