var fs          = require("fs");
const {cors, debug}    = require("./config.json");

module.exports = (request, response, next)=>{
    console.log(request.header("Origin"));
    var uri = request.originalUrl.split("/");
    if(uri[1]=="image") return next();
    if(debug && !request.header("Origin")) return next();
    else if(cors[request.header("Origin")]){
        response.header('Access-Control-Allow-Origin', request.header("Origin"));
        response.header('Access-Control-Allow-Methods', '*');
        response.header('Access-Control-Allow-Headers', '*');
        return next();
    }else return response.json({
        status:400,
        message:"Không có quyền truy cập!"
    });
}