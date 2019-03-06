const braintree = require('braintree')
let response

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BT_MERCHANTID,
  publicKey: process.env.BT_PUBLICKEY,
  privateKey: process.env.BT_PRIVATEKEY
})

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    let body = JSON.parse(event.body)
    let nonceFromTheClient = body.nonce
    let amount = body.amount
    console.log('starting braintree transaction', body)
    let result = await gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    })
    console.log('transaction done.', result)

    response = {
      'statusCode': 200,
      'headers': {
        'Access-Control-Allow-Origin': '*'
      },
      'body': JSON.stringify({
        success: result.success,
        status: result.transaction && result.transaction.status,
        message: result.message
      })
    }
    console.log('Returning response:', response)
  } catch (err) {
    console.log(err)
    return err
  }

  return response
}
