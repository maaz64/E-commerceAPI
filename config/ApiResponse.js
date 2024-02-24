module.exports.ApiResponse = (success,statusCode, data, message,error)=>{

    return {
        success,statusCode,data,message,error
    }
}