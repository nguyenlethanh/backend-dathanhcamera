var res         = require("../../base/Response");
var Controller  = require("../../base/Controller");
var ImageModel  = require("../models/ImageModel");
var imageModel  = new ImageModel();
var controller  = new Controller({model: imageModel});
var upload      = require("../../base/Upload");
var fs          = require("fs");
var {uid}   = require("uid");

module.exports  = {
    index: (request, response)=>controller.index(request, response),
    create: async (request, response)=>{
        var files = request.files;
        if(files){
            var folder = `upload/product/${request.body.id}`;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            var data = [];
            if(Array.isArray(files.image)){
                for(var item of files.image){ 
                    var name = Date.now() + uid(50)+".jpg";
                    var path = folder+"/"+name;
                    await upload.image(item.data,{width:800, path:path});
                    data.push({product_id: request.body.id, name: name, status: 0});
                }
            }else{
                var name = Date.now() +  uid(50)+".jpg";
                var path = folder+"/"+name;
                await upload.image(files.image.data,{width:800, path:path});
                data.push({product_id: request.body.id, name: name, status: 0});
            }
            imageModel.insert(data)
            .then(result=>imageModel.select(["*"]).where({colum:"product_id", value:request.body.id}).get())
            .then(result=>res.success(response, {data: result}))
            .catch(error=>res.error(response,{error:error}));
        }else response.json({status:0});
    },
    delete: (request, response) => {
        var path = `upload/company/${request.params.id}`;
        return controller.deleteHaveAImage(request, response, {name: "name", path: path});
    }
}