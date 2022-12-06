var res                 = require("../../base/Response");
var Controller          = require("../../base/Controller");
var DiscountCodeModel   = require("../models/DiscountCodeModel");
var discountCodeModel   = new DiscountCodeModel();
var controller          = new Controller({model: discountCodeModel});
var moment              = require("moment");

module.exports = {
    check:  (request, response)=>{
        var date = new Date();
        discountCodeModel
        .select(["discount_code.*"])
        .leftJoin({table: "used_code", on: "discount_code.id=used_code.discount_code_id"})
        .where({colum: "discount_code.code", value: request.query.code})
        .where({colum: "used_code.user_id", value: request.user.id})
        .get()
        .then(async results=>{
            if(results.length) return {error:true, message: "Mã code đã được sử dụng!"}
            else{
                var results = await discountCodeModel.select("*")
                .where({colum: "code", value: request.query.code})
                .where({colum: "start", comparison: "<=", value: moment(date).format("YYYY-MM-DD")})
                .where({colum: "finish", comparison: ">=",value: moment(date).format("YYYY-MM-DD")})
                .get();
                console.log(request.query);
                var checkUsedNumber = await discountCodeModel.checkUsedNumber(request.query.code);
                if(results.length && checkUsedNumber.length && checkUsedNumber[0].number > checkUsedNumber[0].used)
                return {
                    error:false,
                    results: results
                };
                else return {error:true, message: "Mã giảm giá không tồn tại!"};
            }
        })
        .then(results=>{
            if(results.error) return res.error(response, {message: results.message});
            else return res.success(response, {data: results.results});
        })
        .catch(error=>res.error(response, {error:error}));
    },
    index:  (request, response) => {
        var data = {
            size: request.query.size ? request.query.size : 20,
            page: request.query.page ? request.query.page : 1
        };
        discountCodeModel.getAllPaginate(data)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.create(request, response),
    update: (request, response) => controller.update(request, response),
    delete: (request, response) => controller.delete(request, response)
}