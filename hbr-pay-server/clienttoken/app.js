const Auth = require('/opt/Auth')
const Util = require('/opt/Util')
const braintree = require('braintree')
const PayDB = require('/opt/PayDB')

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BT_MERCHANTID,
    publicKey: process.env.BT_PUBLICKEY,
    privateKey: process.env.BT_PRIVATEKEY
})

exports.lambdaHandler = async (event /*, context*/) => {
    try {
        let userId = Auth.getCurrentUserId(event)
        if (!userId) {
            return Util.getClientErrorResponse({ message: 'No user id' })
        }

        let customerRec = await PayDB.getCustomerByUserId(userId)
        let customerId = ((customerRec || {}).Item || {}).customerId
        let clientToken = undefined
        if (customerId) {
            let response = await gateway.clientToken.generate({
                customerId: customerId
            })
            clientToken = response.clientToken
        }

        return Util.getSuccessResponse({
            clientToken
        })
    } catch (err) {
        console.log(err)
        return Util.getGeneralErrorResponse()
    }
}
