var fs                  = require("fs");
const config            = require("../../../config.json");
var jwt                 = require("jsonwebtoken");
var bcrypt              = require("bcrypt");
const {OAuth2Client}    = require('google-auth-library');
const client            = new OAuth2Client(config.login.clientId);
var res                 = require("../../base/Response");
var UserModel           = require("../models/UserModel");
var userModel           = new UserModel();
var expiresIn           = "7d";
var CartModel           = require("../models/CartModel");
var cartModel           = new CartModel();
var {uid}           = require("uid");
var sendMail            = require("../../base/Mail");

module.exports = {
    forgotPassword: (request, response)=>{
        var data = {
            code: uid(8)
        };
        userModel.where({colum: "email", value: request.query.email}).update(data)
        .then(()=>{
            var mainOptions = {
                from: 'dathanhcamera.com',
                to: request.query.email,
                subject: `Quên mật khẩu`,
                text: `dathanhcamera.com`,
                html: `<h2>Bấm vào link để đổi mật khẩu <a href="http://dathanhcamera.com/doi-mat-khau?code=${data.code}&email=${request.query.email}">Đổi mật khẩu</a></h2>`
            };
            if(request.query.email) sendMail(mainOptions);
            return res.success(response, {data:true});
        })
        .catch(error=>{res.error(response, {error:error})});
    },
    changePassword: (request, response)=>{
        var data = {password: request.body.password};
        var salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        
        userModel.anyWhere({code: request.body.code, email:request.body.email}).update(data)
        .then(async results=>{
            if(results.changedRows){
                await userModel.where({colum: "email", value: request.body.email}).update({code: uid(8)});
                return res.success(response, {data:true, message: "Đổi mật khẩu thành công!"});
            }else res.error(response, {message: "Mã code đã hết hạn!"});
        })
        .catch(error=>res.error(response, {error:error}));
    },
    register:(request, response)=>{
        var data = {
            username: request.body.username,
            password: request.body.password,
            fullname: request.body.fullname,
            email   : request.body.email
        };
        var salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        userModel.insert(data).then(()=>res.success(response, {data: true}))
        .catch(error=>res.error(response, {error:error}));
    },
    login: (request, response)=>{
        userModel.getAll({ column:["*"], where:{username: request.body.username} }).then(results=>{
            if(results.length){
                var checkPassword = bcrypt.compareSync(request.body.password, results[0].password);// return true||false
                if(checkPassword){
                    const itemUser = {
                        id          : results[0].id,
                        username    : results[0].username,
                        fullname    : results[0].fullname,
                        phone       : results[0].phone,
                        email       : results[0].email,
                        birthday    : results[0].birthday,
                        address     : results[0].address,
                        cmnd        : results[0].cmnd,
                        facebook    : results[0].facebook,
                        imageCMND1  : results[0].imageCMND1,
                        imageCMND2  : results[0].imageCMND2,
                        imageOther11: results[0].imageOther11,
                        imageOther12: results[0].imageOther12,
                        imageOther21: results[0].imageOther21,
                        imageOther22: results[0].imageOther22
                    };
                    const tokenDTC = jwt.sign(itemUser, "@Theanhit@", {expiresIn: expiresIn});
                    return res.success(response, {data:{ token: tokenDTC, user: itemUser}, message: "Đăng nhập thành công!"});
                }else return res.error(response,{ error: [{param: "password", msg: "Sai mật khẩu!"}], message: "Đăng nhập không thành công!"});
            }else return res.error(response, { error: [{param: "username", msg: "Tên đăng nhập không tồn tại!"}], message: "Đăng nhập không thành công!"});
        }).catch(error => res.error(response, { error: error}));
    },
    loginWithGoogle: async (request, response)=>{
        let token = request.body.token;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.login.google.clientId,
        });
        const google_id = ticket.getUserId();
        var user = await userModel.getInfoByGoogleId(google_id);

        if(user.length==0){
            // create user
            var newUser = {
                username: ticket.payload.email,
                fullname: `${ticket.payload.family_name} ${ticket.payload.given_name}`,
                email: ticket.payload.email,
                google_id: google_id
            };
            await userModel.insert(newUser).then(res=>console.log(res)).catch(error=>console.log(error));
            user = await userModel.getInfoByGoogleId(google_id);
        }

        const itemUser = {
            id: user[0].id,
            username: user[0].username,
            fullname: user[0].fullname,
            phone: user[0].phone,
            email: user[0].email,
            birthday: user[0].birthday,
            address: user[0].address,
            cmnd: user[0].cmnd,
            facebook: user[0].facebook,
            imageCMND1: user[0].imageCMND1,
            imageCMND2: user[0].imageCMND2,
            imageOther11: user[0].imageOther11,
            imageOther12: user[0].imageOther12,
            imageOther21: user[0].imageOther21,
            imageOther22: user[0].imageOther22,
        };
        const tokenDaThanhCamera = jwt.sign(itemUser, "@Theanhit@", {expiresIn: expiresIn});
        return res.success(response, {data:{ token: tokenDaThanhCamera, user: itemUser}, message: "Đăng nhập thành công!"});
    },
    check:(request, response)=>{
        return res.success(response, {data:null, message: "Chào mừng đến với trang quản trị!"});
    },
    info:(request, response)=>{
        userModel.getInfo(request.user.id)
        .then(results=>res.success(response, {data: results[0]}))
        .catch(error=>res.error(response, {error:error}));
    },
    history: (request, response)=>{
        var query = {
            user_id : request.user.id,
            status  : request.query.status  ? request.query.status  : false,
            page    : request.query.page  ? request.query.page    : 1,
            size    : request.query.size    ? request.query.size    : 20
        };
        cartModel.getCartByUserId3(query)
        .then(results=>res.success(response, {data: results}))
        .catch(error=>res.error(response, {error: error}))
    },
    cart:(request, response)=>{
        var query={
            user_id: request.user.id ? (request.user.id==1 ? "" : request.user.id) : "",
            cart_id:   request.params.cart_id
        };
        cartModel.getCartByUserId2(query)
        .then(results=>res.success(response, {data: results}))
        .catch(error=>res.error(response, {error: error}))
    },
    deleteCart: (request, response) => {
        cartModel.where({id: request.params.id, user_id: request.user.id}).delete()
        .then(results=>res.success(response, {data: results}))
        .catch(error=>res.error(response, {error: error}))
    }
}