var res         = require("../../base/Response"); 
var Controller  = require("../../base/Controller");
var UserModel   = require("../models/UserModel");
var userModel   = new UserModel();
var controller  = new Controller({model: userModel});
var {uid}   = require("uid");
var {image}     = require("../../base/Upload");
var fs          = require("fs");
var moment      = require("moment");

module.exports  = {
    index   : (request, response) => {
        var query = {
            status  : request.query.status  ? request.query.status  : false,
            page    : request.query.page    ? request.query.page    : 1,
            size    : request.query.size    ? request.query.size    : 20
        };
        userModel.getUsersPaginate(query)
        .then(results=>res.success(response, {data:results}))
        .catch(error=>res.error(response, {error:error}));
    },
    view    : (request, response) => controller.view(request, response),
    edit    : async (request, response)=>{
        try {
            var user        = JSON.parse(request.body.user);
            user.birthday   = moment(user.birthday).format("YYYY-MM-DD"); 
            var files       = request.files;
            for(var key in files){
                var pathOld = `upload/user/${user[key]}`;
                if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);
                var name    = uid(40)+".jpeg";
                user[key]   = name;
                await image(files[key].data,{width: 800, path: `upload/user/${name}`})
            }
        } catch (error) {
            console.log(error);
        }
        
        userModel.where({colum: "id", comparison: "=", value: request.user.id}).update(user)
        .then(()=>userModel.getInfo(user.id))
        .then(results=>res.success(response, {data: results[0]}))
        .catch(error=>res.error(response, {error: error}));
    },  
    create  : (request, response) => controller.createHaveAImage(request, response, {name: "image", width: 500, path:"upload/user"}),
    update  : (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: 500, path:"upload/user"}),
    delete  : (request, response) => controller.deleteHaveAImage(request, response, {name: "image", path:"upload/user"})
}