var Controller          = require("../../base/Controller");
var res                 = require("../../base/Response");
var CartModel           = require("../models/CartModel"); 
var cartModel           = new CartModel();
var UserModel           = require("../models/UserModel"); 
var userModel           = new UserModel();
var CartDetailModel     = require("../models/CartDetailModel");
var cartDetailModel     = new CartDetailModel();
var DiscountCodeModel   = require("../models/DiscountCodeModel");
var discountCodeModel   = new DiscountCodeModel();
var UsedCodeModel       = require("../models/UsedCodeModel");
var usedCodeModel       = new UsedCodeModel();
var controller          = new Controller({model: cartModel});
var moment              = require("moment");
var sendMail            = require("../../base/Mail");
var fs                  = require("fs");

module.exports = {
    index:  (request, response) => {
        var time_to     = new moment(request.query.time_to);
        var time_from   = new moment(request.query.time_from);
        var query       = {
            time_to     : request.query.time_to     ? time_to.format("YYYY-MM-DD")     : false,
            time_from   : request.query.time_from   ? time_from.format("YYYY-MM-DD")   : false,
            status      : request.query.status      ? request.query.status : false,
            orderBy     : request.query.orderBy     ? request.query.orderBy: "ASC",
            page        : request.query.page        ? request.query.page   : 1,
            size        : request.query.size        ? request.query.size   : 20
        };
        cartModel.getCart2(query)
        .then(results=>res.success(response, {data: results}))
        .catch(error=>res.error(response, {error:error}));
    },
    view:   (request, response) => controller.view(request, response),
    create: (request, response) =>{
        var date    = new moment(request.body.date);
        var start   = date.format("YYYY-MM-DD HH:mm:ss");

        var cart = {
            user_id : request.body.user_id,
        };
        cartModel.insert(cart).then(async results=>{
            var cartdetail = request.body.data.map((e)=>{
                return {
                    cart_id     : results.insertId,
                    product_id  : e.product_id,
                    total       : e.total,
                    start       : start,
                    finish      : moment(request.body.date).add(24*e.total, 'h').format("YYYY-MM-DD HH:mm:ss"),
                    cost        : e.cost
                }
            });
            var checkCode = await discountCodeModel
            .select(["discount_code.*"])
            .leftJoin({table: "used_code", on: "discount_code.id=used_code.discount_code_id"})
            .where({colum: "discount_code.code", value: request.body.code})
            .where({colum: "used_code.user_id", value: request.body.user_id})
            .get();
            if(!checkCode.length){
                var checkCode = await discountCodeModel.select("*")
                .where({colum: "code", value: request.body.code})
                .where({colum: "start", comparison: "<=", value: date.format("YYYY-MM-DD")})
                .where({colum: "finish", comparison: ">=",value: date.format("YYYY-MM-DD")})
                .get();
                var checkUsedNumber = await discountCodeModel.checkUsedNumber(request.body.code);
                if(checkCode.length && checkUsedNumber.length && checkUsedNumber[0].number > checkUsedNumber[0].used) await usedCodeModel.insert({
                    discount_code_id: checkCode[0].id,
                    user_id: request.body.user_id, 
                    cart_id: results.insertId
                });
            }
            return cartDetailModel.insert(cartdetail);
        }).then(()=>{
            var mainOptions = {
                from: 'dathanhcamera.com',
                to: 'nguyenlethanhhh@gmail.com',
                subject: `C?? ????n thu?? m???i ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
                text: `dathanhcamera.com`,
                html: `<h2>C?? ????n thu?? m???i <a href="http://dathanhcamera.com/admin/cart">Link qu???n l?? ????n thu??</a></h2>`
            };
            sendMail(mainOptions);
            return res.success(response, {data:null});
        })
        .catch(error=>res.error(response, {error: error}));
    },
    update: (request, response) => controller.update(request, response),
    updateStatus    : (request, response) => {
        var data = {
            status: request.query.status
        };
        var status = {
            "-1":{isSendMail:true, content:"???? h???y"},
            0:{isSendMail:true, content:"Ch??? x??c nh???n"},
            1:{isSendMail:true, content:"???? x??c nh???n"},
            2:{isSendMail:true, content:"??ang thu??"},
            3:{isSendMail:true, content:"Ho??n th??nh"},
            4:{isSendMail:true, content:"??ang n???(???? tr??? ?????)"},
            5:{isSendMail:true, content:"Tr??? tr???(Ch???a tr??? ?????)"},
        };
        cartDetailModel.select().where({colum:"cart_id", value:request.params.id}).get()
        .then(async results=>{
            var isTrue = true;
            for(var item of results){
                var check = await cartDetailModel.checkUpdateStatus({
                    cart_id     : item.cart_id, 
                    product_id  : item.product_id, 
                    start       : moment(item.start).format("YYYY-MM-DD HH:mm:ss"), 
                    finish      : moment(item.finish).format("YYYY-MM-DD HH:mm:ss")
                });
                if(check.length) isTrue &= false;
                else isTrue &= true;
            }
            if(isTrue) return cartModel.where({colum:"id", value:request.params.id}).update(data);
            else {
                cartModel.where({colum:"id", value:request.params.id}).update({status: "-1", notice: "H???y! Thi???t b??? ???? c?? ng?????i thu??"});
                return false;
            }
        }).then((result)=>{
            if(result){
                var html = `<h2>Ch??o ${request.query.fullname}!</h2>
                <p style="margin:0px;">????n h??ng c???a b???n ???? thay ?????i tr???ng th??i th??nh <strong style="color:red;">"${status[request.query.status].content}"</strong> . <a href="http://dathanhcamera.com/tai-khoan/lich-su-thue" style="color:green;">Xem chi ti???t!</a></p>
                <p> <a href="http://dathanhcamera.com/hop-dong/${request.params.id}">Link h???p ?????ng</a></p>
                <p style="margin:0px;">N???u c?? th???c m???c, vui l??ng li??n h??? v???i ch??ng t??i qua c??c k??nh sau.</p>
                <p>TH??NG TIN LI??N H??? ???? TH??NH Camera Rental</p>
                <p style="margin:0px;">* Facebook   : <a href="https://m.me/DTcamerarental">m.me/DTcamerarental</a></p>
                <p style="margin:0px;">* Zalo       : 0344.73.4429</p>
                <p style="margin:0px;">* Hotline    : 0344.73.4429</p>
                <p style="margin:0px;">* Email      : dathanhcamera@gmail.com</p>
                <p style="margin:0px;">* ?????a ch???    : S??? 132 Nguy???n ?????c Trung-Thanh Kh??-???? N???ng</p>
                <p style="margin:0px;">Th??n m???n,</p>
                <p style="margin:0px;">???? Th??nh Camera Rental</p>
                <img style="max-width:100%;" src="http://api.dathanhcamera.com/image/about/2021I12Z01T19U07h42.jpg"/>`;
                var mainOptions = {
                    from: 'dathanhcamera.com',
                    to: request.query.email,
                    subject: `????n thu?? ???? c???p nh???t tr???ng th??i`,
                    text: `dathanhcamera.com`,
                    html: html
                };
                if (request.query.email && status[request.query.status].isSendMail) sendMail(mainOptions);
                return res.success(response, {data:true});
            }else res.error(response, {message: "Thi???t b??? n??y ???? cho thu??!"});
        })
        .catch(error=>res.error(response, {error:error}));
    },
    delete: (request, response) => {
        var path = `upload/cart/${request.params.id}`;
        if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true });
        return controller.delete(request, response);
    },
    monthRevenue: (request, response) => {
        var search = request.query.search ? request.query.search : "";
        
        cartModel.monthRevenue(request.params.month, search)
        .then(results => res.success(response,{data: results}))
        .catch(error => res.error(response, {error:error}))
    }
}