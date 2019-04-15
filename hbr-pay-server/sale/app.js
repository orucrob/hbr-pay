const Auth = require('/opt/Auth')
const Util = require('/opt/Util')
const PayDB = require('/opt/PayDB')
const braintree = require('braintree')

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BT_MERCHANTID,
    publicKey: process.env.BT_PUBLICKEY,
    privateKey: process.env.BT_PRIVATEKEY
})

exports.lambdaHandler = async (event /*, context*/) => {
    console.log('Input to sale', JSON.stringify(event))
    try {
        let userId = Auth.getCurrentUserId(event)
        if (!userId) {
            return Util.getClientErrorResponse({ message: 'No user id' })
        }

        let body = JSON.parse(event.body || '{}')
        let amount = body.amount
        let nonce = body.nonce
        let settle = body.settle === 'true'
        let storeInVault = body.storeInVault === 'true'

        let customerRec = await PayDB.getCustomerByUserId(userId)
        let customerId = ((customerRec || {}).Item || {}).customerId

        //TODO validate inputs
        //TODO amount should be get from internal order

        let response = await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: nonce,
            //merchantAccountId: "aMerchantAccountId", //Note: use for non default account id
            options: {
                submitForSettlement: settle,
                storeInVaultOnSuccess: storeInVault
            },
            ...(customerId && { customerId })
        })
        console.log('Response from sale', JSON.stringify(response))

        //process response
        let transaction = response.transaction || {}
        let customer = transaction.customer || {}
        await PayDB.putTransaction({
            userId,
            transactionId: transaction.id,
            full: JSON.stringify(transaction)
        })
        if (storeInVault /* && !customerId */) {
            await PayDB.createCustomer({
                userId,
                customerId: customer.id
            })
        }

        console.log('Response saved to DB')

        return Util.getSuccessResponse({
            success: response.success
        })
    } catch (err) {
        console.log(err)
        return Util.getGeneralErrorResponse()
    }
}
