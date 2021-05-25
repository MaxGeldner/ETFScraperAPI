class ETF {
    name
    isin
    price
    previousPrice

    constructor(name, isin, price, previousPrice) {
        this.name = name
        this.isin = isin
        this.previousPrice = previousPrice
        this.price = price
    }
}

module.exports = ETF