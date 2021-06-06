class Coin {
    name
    price
    toCurrency
    previousPrice

    constructor(name, price, toCurrency,previousPrice) {
        this.name = name
        this.previousPrice = previousPrice
        this.price = price
        this.toCurrency = toCurrency
    }
}

module.exports = Coin