module.exports = {
    success: (response, {data, status, message}={})=>{
        let result = {
            status: status ? status : 200,
            message: message ? message : "Thành công!"
        }
        if(data) result.data = data;
        return response.json(result);
    },
    error: (response, {error, status, message}={})=>{
        if(DEBUG) console.log(error);
        return response.json({
            status: status ? status : 400,
            message: message ? message : "Có lỗi xảy ra!",
            errors: DEBUG ? error : ""
        });
    }
}