import axios from 'axios'

class ForexConversionAPI {
  getRates = value => {
    const proxyURL = 'https://cryptic-everglades-70239.herokuapp.com/'
    const targetURL =
      'https://us-central1-ornate-apricot-220209.cloudfunctions.net/CodingTestFrontEnd-API'
    return axios({
      method: 'post',
      url: proxyURL + targetURL,
      data: { amount: value },
      transformResponse: [
        data => {
          let parsedData = JSON.parse(data)
          let formattedResults = {
            USD: parseFloat(parsedData['USD'].toFixed(4)),
            EUR: parseFloat(parsedData['EUR'].toFixed(4)),
          }
          return formattedResults
        },
      ],
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        throw new Error(
          'It looks like the FOREX service is down, please try again later. ' +
            err
        )
      })
  }
}

export default new ForexConversionAPI()
