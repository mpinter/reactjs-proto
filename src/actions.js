function fetch(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.responseText)
      }
    }
    xhr.open('GET', url, true)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.send(null)
  })
}

function post(url, json) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.responseText)
      }
    }
    xhr.open('POST', url, true)
    //xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Accept', '*/*')
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(json))
  })
}

// from http://www.html5rocks.com/en/tutorials/file/xhr2/
function upload(url, file, updateProgress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    // Listen to the upload progress.
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        console.log(((e.loaded / e.total) * 100))
        updateProgress((e.loaded / e.total) * 100)
      }
    }
    xhr.onload = () => {
      let response = JSON.parse(xhr.responseText)
      if (response.error != null) {
        return reject('RESPONSE_ERROR', response.error)
      }
      if (xhr.status !== 200) {
        return reject('SERVER_ERROR')
      }
      resolve(response)
    }
    xhr.onerror = (e) => reject('REQUEST_ERROR', e)
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-File-Name', file.name)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.send(file)
  })
}

export default function actions(url) {
  return {
    exampleFetch(something) {
      return fetch(`${url}/${something}`) //returns promise
    },
    examplePost(something) {
      return post(`${url}/${something}`) //returns promise
    },
    fetchLessons() { 
      return fetch(`${url}/api/mobileapp-example`) // api endpoint available on skillandia api-example branch
    }
  }
}