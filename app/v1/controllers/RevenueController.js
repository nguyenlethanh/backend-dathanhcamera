var res             = require("../../base/Response");
var CartModel = require("../models/CartModel");
var cartModel = new CartModel();
var CartDetailModel = require("../models/CartDetailModel");
var cartDetailModel = new CartDetailModel();
var moment          = require("moment");
module.exports = {
    index: (request, response)=>{
        var time_to     = new moment(request.query.time_to);
        var time_from   = new moment(request.query.time_from);
        var query       = {
            time_to     : request.query.time_to     ? time_to.format("YYYY-MM-DD")     : false,
            time_from   : request.query.time_from   ? time_from.format("YYYY-MM-DD")   : false,
            status      : request.query.status      ? request.query.status             : false
        };
        cartModel.revenue(query)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}))
    },
    index2: (request, response)=>{
        var time_to     = new moment(request.query.time_to);
        var time_from   = new moment(request.query.time_from);
        var query       = {
            time_to     : request.query.time_to     ? time_to.format("YYYY-MM-DD")     : false,
            time_from   : request.query.time_from   ? time_from.format("YYYY-MM-DD")   : false,
            status      : request.query.status      ? request.query.status             : false
        };
        cartDetailModel.revenue(query)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}))
    }
}