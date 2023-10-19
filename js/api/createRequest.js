/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}, callback) => {

    const params = new URLSearchParams(options.data)
    const url = new URL(options.url)
    url.search = params.toString()

    fetch(url.href, {
        method: options.method,
        headers: options.headers,
        credentials: 'include',
    })
        .then(response => {
            if (response.status < 204) {
                return response.json()
            } else if (response.status === 204) {
                return false
            } else {
                throw new Error('Response was not ok');
            }
        })
        .then (data => {
            return callback(data)
        })
        .catch(error => {
            console.error(error)
        })

    // const xhr = new XMLHttpRequest()
    // xhr.responseType = 'json'
    //
    // try {
    //     xhr.open(options.method , url.href, true)
    //
    //     if (options.headers) {
    //         Object.keys(options.headers)
    //             .map(key => xhr.setRequestHeader(key, options.headers[key]))
    //     }
    //
    //     xhr.withCredentials = true
    //     xhr.send()
    // }
    // catch (err) {
    //     console.error(err)
    // }
    //
    // xhr.addEventListener('readystatechange', () => {
    //     if (xhr.readyState === xhr.DONE) {
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             callback(xhr.response)
    //         } else {
    //             console.log(xhr.response.error, 'error')
    //             callback(xhr.response.message)
    //         }
    //     }
    // })
}
