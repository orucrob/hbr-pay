let getCurrentUserId = event => {
    let claims = (((event || {}).requestContext || {}).authorizer || {}).claims || {}
    return claims['sub']
}
let getGeneral401 = () => {
    return {
        statusCode: 401,
        body: JSON.stringify({
            message: 'You are not authorized to access this resource'
        })
    }
}

exports.getCurrentUserId = getCurrentUserId
exports.getGeneral401 = getGeneral401
