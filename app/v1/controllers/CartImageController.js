var res             = require("../../base/Response");
var Controller      = require("../../base/Controller");
var CartImageModel  = require("../models/CartImageModel");
var cartImageModel  = new CartImageModel();
var controller      = new Controller({model: cartImageModel});
var upload          = require("../../base/Upload");
var fs              = require("fs");
var {uid}       = require("uid");

module.exports  = {
    index: (request, response)=>controller.index(request, response),
    create: async (request, response)=>{
        var files = request.files;
        if(files){
            var folder = `upload/cart/${request.body.id}`;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            var data = [];
            if(Array.isArray(files.image)){
                for(var item of files.image){ 
                    var name = Date.now() + uid(50)+".jpg";
                    var path = folder+"/"+name;
                    await upload.image(item.data,{width:null, path:path});
                    data.push({cart_id: request.body.id, name: name});
                }
            }else{
                var name = Date.now() +  uid(50)+".jpg";
                var path = folder+"/"+name;
                await upload.image(files.image.data,{width:800, path:path});
                data.push({cart_id: request.body.id, name: name});
            }
            cartImageModel.insert(data)
            .then(()=>cartImageModel.select(["*"]).where({colum: "cart_id", value: request.body.id}).get())
            .then(results=>res.success(response, {data: results}))
            .catch(error=>res.error(response,{error:error}));
        }else response.json({status:0});
    },
    delete: (request, response) => {
        var path = `upload/cart/${request.query.cart_id}`;
        return controller.deleteHaveAImage(request, response, {name: "name", path: path});
    }
}