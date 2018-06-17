exports.calculateDiference = function (priceEstipulated, fairPrice) {
    // metric is 25%

    const value = (priceEstipulated - fairPrice) / priceEstipulated * 100

    const percent = Math.floor(value.toString().replace(/0+/, ''));

    if (percent > 25) {
        return {
            percentageAbove: percent,
            suspect: true
        }
    } else {
        return {
            percentageAbove: percent,
            suspect: false
        }
    }
}

