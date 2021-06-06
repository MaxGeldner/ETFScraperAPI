const fs = require('fs')

const isinCacheValidityHours = 24
const cryptoCacheValidityHours = 1

const Cache = {
    checkIsinCache(isin) {
        const cache = fs.readFileSync('cache/byIsin.json', 'utf8')
        const cacheJSON = JSON.parse(cache)
    
        if (cacheJSON.hasOwnProperty(isin)) {
            const cachedObject = cacheJSON[isin]
            const age = new Date() - new Date(cachedObject.cached)
            if (age / 1000 / 60 / 60 >= isinCacheValidityHours) {
                cachedObject.valid = false
                return cachedObject
            }
            return cachedObject
        }
        return false
    },
    
    cacheToIsinCache(object) {
        const cache = fs.readFileSync('cache/byIsin.json', 'utf8')
        const cacheJSON = JSON.parse(cache)
    
        object.cached = new Date().getTime()
        cacheJSON[object.isin] = object
    
        fs.writeFileSync('cache/byIsin.json', JSON.stringify(cacheJSON));
    },

    checkCryptoCache(name) {
        const cache = fs.readFileSync('cache/cryptoByName.json')
        const cacheJSON = JSON.parse(cache)

        if (cacheJSON.hasOwnProperty(name)) {
            const cachedObject = cacheJSON[name]
            const age = new Date() - new Date(cachedObject.cached)
            if (age / 1000 / 60 / 60 >= cryptoCacheValidityHours) {
                cachedObject.valid = false
                return cachedObject
            }
            return cachedObject
        }
    },

    cacheToCryptoCache(object) {
        const cache = fs.readFileSync('cache/cryptoByName.json', 'utf8')
        const cacheJSON = JSON.parse(cache)
    
        object.cached = new Date().getTime()
        cacheJSON[object.name] = object
    
        fs.writeFileSync('cache/cryptoByName.json', JSON.stringify(cacheJSON));
    },
}
 module.exports = Cache