import 'whatwg-fetch'

function requestApi (url, method) {
  return function (body) {
    return fetch(url, {
      credentials: 'same-origin',
      method: method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(function (response) {
      return response.json()
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    })
  }
}

module.exports = requestApi
