const express = require('express')
const axios = require('axios')
const parse = require('node-html-parser').parse
const fs = require('fs')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors());

const isinCacheValidityHours = 24

app.get('/', async (req, res) => {
  const isin = req.query.isin
  let previousPrice = false
  if (!isin) {
    res.json({})
  } else {
      const cacheResult = checkIsinCache(isin)
      if (cacheResult) {
          if (cacheResult.valid === false) {
            previousPrice = cacheResult.price
          } else {
            res.json(cacheResult)
            return
          }
      }
  }

  let price = 0.00
  let name = ''
  try {
    // const response = await axios.get('https://www.justetf.com/de/etf-profile.html?isin=' + isin)
    // const data = response.data
    price = /*parse(data).querySelectorAll('.val')[3].innerText.split('\n')[2].trim()*/'72,71'
    name = /*parse(data).querySelectorAll('#eprofile .e_head h1 span.h1')[0].innerText*/'Xtrackers MSCI World UCITS ETF 1C'
  } catch (error) {
    console.log(error)
    return
  }

  const etfObject = { 
    price: parseFloat(price.replace(',', '.')),
    isin,
    name,
    previousPrice
  }

  cacheToIsinCache(etfObject)
  res.json(etfObject)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function checkIsinCache(isin) {
    const cache = fs.readFileSync('cache/byIsin.json', 'utf8')
    const cacheJSON = JSON.parse(cache)

    if (cacheJSON.hasOwnProperty(isin)) {
        const cachedObject = cacheJSON[isin]
        const age = new Date() - new Date(cachedObject.cached)
        if (age / 60 / 60 >= isinCacheValidityHours) {
            cachedObject.valid = false
            return cachedObject
        }
        return cachedObject
    }
    return false
}

function cacheToIsinCache(object) {
    const cache = fs.readFileSync('cache/byIsin.json', 'utf8')
    const cacheJSON = JSON.parse(cache)

    object.cached = new Date().getTime()
    cacheJSON[object.isin] = object

    fs.writeFileSync('cache/byIsin.json', JSON.stringify(cacheJSON));
}