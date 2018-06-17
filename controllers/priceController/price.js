
const winston = require('winston')
const jwt = require('jsonwebtoken')
const PriceDao = require('../../dao/PriceDao')
const jwtConfig = require('../../config/jwtConfig')
const keysConfig = require('../../config/keysConfig')
const axios = require('axios')
const priceHelper = require('../../helper/priceHelper')



exports.getListBiddingPrices = async function (req, res) {

    return PriceDao.getBiddingProcess()
        .then(async result => {

            const getSuspectOrNotSuspect = () => Promise.all(

                result.map(async item => {

                    const priceEstipulated = item.current_budget_total;
                

                })
            )

            const list = await getSuspectOrNotSuspect()


            return res.json(relistsult)

        })
        .catch(error => {

            winston.error(`price -> getListBiddingPrices - *Internal Server error - ${error}*`)
            return res.status(500).json({
                status: 500,
                message: "Internal Server error - " + error
            })
        })

}





// To use as helper


// To access by route
const getTotalPrice = () => {

    // const { listGtinCode } = req.body;
    const listGtinCode = "7898235830379\n7898558119342\n3100002022745\n7897255920268\n7898453310639\n7892183345428"
    const qtdGtin = "60,120,5,100,80,10000";
    const employeesInfo = [
        { name: "arquiteto", salary: "11000.6", qtd: 1 },
        { name: "Engenheiro Civil", salary: "8000.0", qtd: 2 },
        { name: "Mestre Obras", salary: "5000.0", qtd: 2 },
        { name: "segurança", salary: "1900.0", qtd: 4 },
        { name: "Limpeza", salary: "1400.0", qtd: 6 }
    ]

    const priceEstipulated = "100000.0"

    const country = "br";
    const source = "google-shopping";
    const currentness = "realtime";
    const completeness = "one_page";
    const key = "gtin";
    const token = keysConfig.price_api_token;

    if (!listGtinCode) {
        winston.error('getTotalPrice -> body -  *Bad Request - Missing parameters*')
        return res.status(400).json({
            status: 400,
            message: "Bad Request - Missing parameters "
        })
    }


    return axios.post('https://api.priceapi.com/jobs', {
        country,
        source,
        currentness,
        completeness,
        key,
        values: listGtinCode,
        token
    })
        .then(item => {
            const job_id = item.data.job_id
            setTimeout(() => {
                return axios(`https://api.priceapi.com/products/bulk/${job_id}?token=${token}`)
                    .then(async job => {
                        const products = job.data.products
                        const priceTotalProducts = await new Promise(function (resolve, reject) {
                            let totalToSpendInProducts = 0;
                            products.map((item, index) => {
                                if (item.success == true) {
                                    const data = item.offers[0]
                                    const price = data.price
                                    const qtdSeparated = qtdGtin.split(`,`)
                                    totalToSpendInProducts = totalToSpendInProducts + (qtdSeparated[index] * price)
                                }

                                if (products.length == (index + 1)) {
                                    resolve(totalToSpendInProducts)
                                }
                            })
                        });

                        const totalPriceEmployees = await new Promise(function (resolve, reject) {
                            let totalPrice = 0;
                            employeesInfo.map((item, index) => {
                                const salary = item.salary
                                const qtd = item.qtd;

                                totalPrice = totalPrice + (salary * qtd);

                                if (employeesInfo.length == (index + 1)) {
                                    resolve(totalPrice)
                                }
                            })
                        })

                        const fairTotal = totalPriceEmployees + priceTotalProducts;
                        // Metric based in percent
                        const checkSuspect = priceHelper.calculateDiference(priceEstipulated, fairTotal)
                        return res.json(checkSuspect)

                    }).catch(error => {
                        console.log(error);
                    });
            }, 4000);
        })
        .catch(error => {
            console.log(error);
        });

}




// To access by route
exports.getTotalPrice = function (req, res) {

    // const { listGtinCode } = req.body;
    const listGtinCode = "7898235830379\n7898558119342\n3100002022745\n7897255920268\n7898453310639\n7892183345428"
    const qtdGtin = "60,120,5,100,80,10000";
    const employeesInfo = [
        { name: "arquiteto", salary: "11000.6", qtd: 1 },
        { name: "Engenheiro Civil", salary: "8000.0", qtd: 2 },
        { name: "Mestre Obras", salary: "5000.0", qtd: 2 },
        { name: "segurança", salary: "1900.0", qtd: 4 },
        { name: "Limpeza", salary: "1400.0", qtd: 6 }
    ]

    const priceEstipulated = "100000.0"

    const country = "br";
    const source = "google-shopping";
    const currentness = "realtime";
    const completeness = "one_page";
    const key = "gtin";
    const token = keysConfig.price_api_token;

    if (!listGtinCode) {
        winston.error('getTotalPrice -> body -  *Bad Request - Missing parameters*')
        return res.status(400).json({
            status: 400,
            message: "Bad Request - Missing parameters "
        })
    }


    return axios.post('https://api.priceapi.com/jobs', {
        country,
        source,
        currentness,
        completeness,
        key,
        values: listGtinCode,
        token
    })
        .then(item => {
            const job_id = item.data.job_id
            setTimeout(() => {
                return axios(`https://api.priceapi.com/products/bulk/${job_id}?token=${token}`)
                    .then(async job => {
                        const products = job.data.products
                        const priceTotalProducts = await new Promise(function (resolve, reject) {
                            let totalToSpendInProducts = 0;
                            products.map((item, index) => {
                                if (item.success == true) {
                                    const data = item.offers[0]
                                    const price = data.price
                                    const qtdSeparated = qtdGtin.split(`,`)
                                    totalToSpendInProducts = totalToSpendInProducts + (qtdSeparated[index] * price)
                                }

                                if (products.length == (index + 1)) {
                                    resolve(totalToSpendInProducts)
                                }
                            })
                        });

                        const totalPriceEmployees = await new Promise(function (resolve, reject) {
                            let totalPrice = 0;
                            employeesInfo.map((item, index) => {
                                const salary = item.salary
                                const qtd = item.qtd;

                                totalPrice = totalPrice + (salary * qtd);

                                if (employeesInfo.length == (index + 1)) {
                                    resolve(totalPrice)
                                }
                            })
                        })

                        const fairTotal = totalPriceEmployees + priceTotalProducts;
                        // Metric based in percent
                        const checkSuspect = priceHelper.calculateDiference(priceEstipulated, fairTotal)
                        return res.json(checkSuspect)

                    }).catch(error => {
                        console.log(error);
                    });
            }, 4000);
        })
        .catch(error => {
            console.log(error);
        });

}
