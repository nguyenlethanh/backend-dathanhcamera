var res             = require("../../base/Response");
var Controller      = require("../../base/Controller");
var CartDetailModel = require("../models/CartDetailModel");
var cartDetailModel = new CartDetailModel();
var controller      = new Controller({model: cartDetailModel});
var moment          = require("moment");

module.exports = {
    check   : (request, response)=>{
        var date    = new moment(request.body.date);
        var start   = date.format("YYYY-MM-DD HH:mm:ss");
        var finish  = date.add(24*request.body.total, 'h').format("YYYY-MM-DD HH:mm:ss");
        var data    = {
            product_id  : request.body.product_id,
            start       : start,
            finish      : finish
        };
        cartDetailModel.check(data)
        .then(results=>res.success(response, {data: results }))
        .catch(error=>res.error(response, {error:error}));
    },
    now     : (request, response)=>{
        cartDetailModel.now(request.query.product_id)
        .then(results=>res.success(response, {data: results }))
        .catch(error=>res.error(response, {error:error}));
    },
    rentList: (request, response)=>{
        var start   = moment(request.query.time_from).format("YYYY-MM-DD HH:mm:ss");
        var finish  = moment(request.query.time_to).format("YYYY-MM-DD HH:mm:ss");
        var data    = {
            start       : start,
            finish      : finish
        };
        cartDetailModel.rentList(data)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    index   : (request, response) => controller.index(request, response),
    view    : (request, response) => controller.view(request, response),
    create  : (request, response) => controller.create(request, response),
    update  : (request, response) => controller.update(request, response),
    delete  : (request, response) => controller.delete(request, response)
}