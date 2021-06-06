const Cache = require('../../cache/cache')
const Coin = require('../../objects/coin')
const axios = require('axios')
const parse = require('node-html-parser').parse

const CryptoEndpoint = {
    async getByName(name) {
        let previousPrice = false
        if (!name) {
            return {}
        } else {
            const cacheResult = Cache.checkCryptoCache(name)
            if (cacheResult) {
                if (cacheResult.valid === false) {
                    previousPrice = cacheResult.price
                } else {
                    return cacheResult
                }
            }
        }

        let price = 0.00
        try {
            // todo: EUR is the currency the exchange rate is calculated to, should prob. be customizable
            console.log('API Request')
            const response = await axios.get(`https://api.coinbase.com/v2/prices/${name}-EUR/buy`)
            price = response.data.data.amount
        } catch (error) {
            console.log(error)
            return
        }

        const coinObject = new Coin(name, price, 'EUR', previousPrice)

        Cache.cacheToCryptoCache(coinObject)
        return coinObject
    }
}

module.exports = CryptoEndpoint