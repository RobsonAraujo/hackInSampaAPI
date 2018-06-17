const connectionFactory = require('../services/connectionFactory')
const knex = connectionFactory.knex;
const security = require('../services/security')

module.exports = {
    async getBiddingProcess() {

        let biddingProcess = await knex('biddingProcess');

        let completeBidding = () => Promise.all(
            biddingProcess.map(item => {

                return new Promise(async function (resolve, reject) {

                    let complete = { item };



                    const listMaterial = await knex.select('gtinCode', 'qtd').from('biddingProcess_material').where('id_biddingProcess', item.id_biddingProcess)

                    complete = Object.assign(complete, { listMaterial })

                    const listEmployees = await knex.select('salary', 'qtd').from('biddingProcess_employees').where('id_biddingProcess', item.id_biddingProcess)

                    complete = Object.assign(complete, { listEmployees })

                    //console.log(`complete`, complete)
                    resolve(complete)
                })

            })
        )

        const completeData = await completeBidding()


        return completeData

    }

}