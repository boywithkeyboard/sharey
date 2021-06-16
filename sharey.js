// handle file upload
function uploadHandler(endpoint, param, file, callback) {
  const formData = new FormData()
  formData.append(param, file)

  let code = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  const charactersLength = characters.length
  for ( var i = 0; i < 32; i++ ) {
    code += characters.charAt(Math.floor(Math.random() * 
    charactersLength))
  }

  fetch(endpoint, { method: 'POST', body: formData })
    .then((response) => {
      const data = response.json()
      data.stoken = code
      callback(data)
    })
}

// get readable size
function readableSize(size) {
  size = size.toString()
  const length = size.length
  const round = (number, decimalPlaces) => {
    number = Math.round(number + 'e' +decimalPlaces)
    return Number(number + 'e' + -decimalPlaces)
  }

  if (length < 4) return `${size} B`
  if (length >= 4 && length < 7) return `${round(size / 1000, 2)} KB`
  if (length >= 7 && length < 10) return `${round(size / 1000000, 2)} MB`
  if (length >= 10 && length < 13) return `${round(size / 1000000000, 2)} GB`
  if (length >= 13) return `${round(size / 1000000000000, 2)} TB`
}

const sharey = {
  // azury.gg
  azury(file, callback) {
    uploadHandler('https://azury.gg/api/accountless/files/new', 'upload', file, (res) => {
      const data = {
        'name': file.name,
        'token': res.stoken,
        'size': file.size,
        'readableSize': readableSize(file.size),
        'type': file.type,
        'url': res.url,
        'uploadedAt': Date.now()
      }

      if (callback) callback(data)
    })
  },

  // starfiles.co
  starfiles(file, callback) {
    uploadHandler('https://api.starfiles.co/upload/upload_file', 'upload', file, (res) => {
      const data = {
        'name': file.name,
        'token': res.stoken,
        'size': file.size,
        'readableSize': readableSize(file.size),
        'type': file.type,
        'url': `https://starfiles.co/file/${res.file}`,
        'uploadedAt': Date.now()
      }

      if (callback) callback(data)
    })
  },

  coffee(file, callback) {
    uploadHandler('https://file.coffee/api/file/upload', 'file', file, (res) => {
      const data = {
        'name': file.name,
        'token': res.stoken,
        'size': file.size,
        'readableSize': readableSize(file.size),
        'type': file.type,
        'url': res.url,
        'uploadedAt': Date.now()
      }

      if (callback) callback(data)
    })
  },

  // gofile.io
  async gofile(file, callback) {
    fetch('https://api.gofile.io/getServer', { method: 'GET' })
    .then((response) => {
      response.json()
        .then((service) => { 
          uploadHandler(`https://${service.data.server}.gofile.io/uploadFile`, 'file', file, (res) => {
            const data = {
              'name': file.name,
              'token': res.stoken,
              'size': file.size,
              'readableSize': readableSize(file.size),
              'type': file.type,
              'url': res.data.downloadPage,
              'uploadedAt': Date.now()
            }
      
            if (callback) callback(data)
          })
        })
    })
  }
}