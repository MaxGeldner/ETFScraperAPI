const fs = require('fs')

const isinCacheValidityHours = 24

const Cache = {
    checkIsinCache(isin) {
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
    },
    
    cacheToIsinCache(object) {
        const cache = fs.readFileSync('cache/byIsin.json', 'utf8')
        const cacheJSON = JSON.parse(cache)
    
        object.cached = new Date().getTime()
        cacheJSON[object.isin] = object
    
        fs.writeFileSync('cache/byIsin.json', JSON.stringify(cacheJSON));
    }
}
 module.exports = Cache