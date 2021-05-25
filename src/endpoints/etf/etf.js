const Cache = require('../../cache/cache')
const ETF = require('../../objects/etf')
const axios = require('axios')
const parse = require('node-html-parser').parse

const ETFEndpoint = {
    async getByISIN(isin) {
        let previousPrice = false
        if (!isin) {
            return {}
        } else {
            const cacheResult = Cache.checkIsinCache(isin)
            if (cacheResult) {
                if (cacheResult.valid === false) {
                    previousPrice = cacheResult.price
                } else {
                    return cacheResult
                }
            }
        }

        let price = 0.00
        let name = ''
        try {
            const response = await axios.get('https://www.justetf.com/de/etf-profile.html?isin=' + isin)
            const data = response.data
            price = parse(data).querySelectorAll('.val')[3].innerText.split('\n')[2].trim() // '72,71'
            name = parse(data).querySelectorAll('#eprofile .e_head h1 span.h1')[0].innerText // 'Xtrackers MSCI World UCITS ETF 1C'
        } catch (error) {
            console.log(error)
            return
        }

        const etfObject = new ETF(name, isin, parseFloat(price.replace(',', '.')), previousPrice)

        Cache.cacheToIsinCache(etfObject)
        return etfObject
    }
}

module.exports = ETFEndpoint