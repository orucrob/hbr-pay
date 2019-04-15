const AWS = require('aws-sdk')
if (process.env.ENDPOINT_OVERRIDE) {
    AWS.config.update({
        endpoint: process.env.ENDPOINT_OVERRIDE
    })
}

const CUSTOMER_TABLE = process.env.CUSTOMER_TABLE
const TRANSACTION_TABLE = process.env.TRANSACTION_TABLE
const documentClient = new AWS.DynamoDB.DocumentClient()

/**
 * Get customer id stored in db by user id
 * @param {string} userId - userId
 */
exports.getCustomerByUserId = async userId => {
    try {
        let data = await documentClient
            .get({
                TableName: CUSTOMER_TABLE,
                Key: {
                    userId
                }
            })
            .promise()
        console.log('getCustomerByUserId:', data)
        return data
    } catch (e) {
        console.log('error (getCustomerByUserId):', e)
        throw e
    }
}

/**
 * create customer in DB. It returns empty object if all OK
 * @param {object} dbRecord - object following required DB structure
 */
exports.createCustomer = async dbRecord => {
    var params = {
        TableName: CUSTOMER_TABLE,
        Item: dbRecord,
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ConditionExpression: 'attribute_not_exists(#userId)',
        ReturnValues: 'ALL_OLD'
    }

    let data = undefined
    try {
        data = await documentClient.put(params).promise()
    } catch (e) {
        if (e.code === 'ConditionalCheckFailedException') {
            console.log('User ID allready exist. Not replacing.' + JSON.stringify(dbRecord))
        } else {
            console.log('Error (createCustomer):', e)
            throw e
        }
    }
    return data
}

/**
 * put transaction info into DB
 * @param {object} dbRecord - object following required DB structure
 */
exports.putTransaction = async dbRecord => {
    var params = {
        TableName: TRANSACTION_TABLE,
        Item: dbRecord,
        // ExpressionAttributeNames: {
        //     '#transactionId': 'transactionId'
        // },
        ReturnValues: 'ALL_OLD'
    }

    let data = undefined
    try {
        data = await documentClient.put(params).promise()
    } catch (e) {
        console.log('Error (putTransaction):', e)
        throw e
    }
    return data
}
