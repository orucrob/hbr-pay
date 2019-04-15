const DEBUG = true //TODO move to params? env var?

let getErrorResponse = ({
    code = 'GENERAL_ERROR',
    message = 'Unexpected error.',
    statusCode = 500,
    err
}) => {
    return {
        isError: true,
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            isError: true,
            code: code,
            message: message,
            statusCode: statusCode,
            ...(DEBUG && { error: err })
        })
    }
}
let getGeneralErrorResponse = err =>
    getErrorResponse({
        code: 'GENERAL_ERROR',
        message: 'Unexpected error.',
        err
    })

let getClientErrorResponse = ({
    code = 'CLIENT_ERROR',
    message = 'Unexpected inputs.',
    statusCode = 400,
    err
}) =>
    getErrorResponse({
        code,
        statusCode,
        message,
        err
    })

let getSuccessResponse = body => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)
    }
}

exports.getErrorResponse = getErrorResponse
exports.getGeneralErrorResponse = getGeneralErrorResponse
exports.getSuccessResponse = getSuccessResponse
exports.getClientErrorResponse = getClientErrorResponse
