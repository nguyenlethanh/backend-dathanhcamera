var {header, check, validationResult}   = require("express-validator");
var jwt                                 = require("jsonwebtoken");

module.exports = {
    auth: [
        header("authorization").custom((value,{req})=>{
            var token = req.get("authorization");
            if(!token) return Promise.reject("Vui lòng đăng nhập!");
            return jwt.verify(token.slice(7), "@Theanhit@", (error,decode)=>{
                if(error) return Promise.reject("Phiên đăng nhập hết hạn!");
                req.user = decode;
                return true;
            });
        }),
        (request, response, next)=>{
            const result = validationResult(request);
            if(!result.isEmpty()) return response.json({
                status: 400,
                message: "Vui lòng đăng nhập!",
                errors: result.errors
            })
            return next();
        }
    ],
    admin:[
        check("admin").custom((value,{req})=>{
           if(req.user.username=="admin") return true;
           else return Promise.reject("Không có quyền truy cập!");
        }),
        (request, response, next)=>{
            const result = validationResult(request);
            if(!result.isEmpty()) return response.json({
                status: 407,
                message: "Vui lòng đăng nhập!",
                errors: result.errors
            })
            return next();
        }
    ]
}