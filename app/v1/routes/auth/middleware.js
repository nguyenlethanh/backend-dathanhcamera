var {header, check, validationResult}   = require("express-validator");
var UserModel                           = require("../../models/UserModel");
var userModel                           = new UserModel();

module.exports = {
    register:[
        check("username").custom(async (value,{req})=>{
            var results = await userModel.select(["id"]).where({colum: "username", value: value}).get();
            if(results.length==0) return true;
            else return Promise.reject("Tên đăng nhập đã được sử dụng!");
        }),
        (request, response, next)=>{
            const result = validationResult(request);
            if(!result.isEmpty()) return response.json({
                status: 407,
                message: "Có lỗi xảy ra!",
                errors: result.errors
            })
            return next();
        }
    ]
}