/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}, callback) => {
    let queryString = ''
    if (options.data) {
        queryString = "?" + Object.keys(options.data)
            .map((key) => `${key}=${encodeURIComponent(options.data[key])}`)
            .join('&')
    }

    const xhr = new XMLHttpRequest
    xhr.responseType = 'json'

    try {
        xhr.open(options.method , options.url + queryString, true)

        if (options.headers) {
            Object.keys(options.headers)
                .map(key => xhr.setRequestHeader(key, options.headers[key]))
        }

        xhr.withCredentials = true
        xhr.send()
    }
    catch (err) {
        console.error(err)
    }

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(xhr.response)
            } else {
                console.log(xhr.response.error, 'error')
                callback(xhr.response.message)
            }
        }
    })
}
