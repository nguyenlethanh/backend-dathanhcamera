var res             = require("../../base/Response");
var Controller      = require("../../base/Controller");
var NicePlaceModel  = require("../models/NicePlaceModel");
var nicePlaceModel  = new NicePlaceModel(); 
var controller      = new Controller({model: nicePlaceModel});
var uploadFile      = require("../../base/Upload");
var {uid}       = require("uid");
var config          = require("../../../config.json");
var fs              = require("fs");

module.exports      = {
    index:  (request, response) => {
        var data = {
            status: request.query.status ? request.query.status : request.query.status == 0 ? 0 : false,
            province_id: request.query.province_id ?  request.query.province_id : false,
            search: request.query.search ? request.query.search : false,
            page: request.query.page ? request.query.page : 1,
            size: request.query.size ? request.query.size : 20
        };
        nicePlaceModel.search(data)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    view:   (request, response) => {
        nicePlaceModel.select(["*"])
        .where({colum:"id", comparison: "=", value: request.params.id})
        .orWhere({colum:"slug", comparison: "=", value: request.params.id})
        .get()
        .then(results=>res.success(response, {data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    create: (request, response) => {
        nicePlaceModel.insert({name:""})
        .then(result=>res.success(response,{data:result}))
        .catch(error=>res.error(response,{error: error}));
    },
    uploadImage: async (request, response)=>{
        var folder = `upload/niceplace/${request.body.id}`;
        if(request.files){
            var name    = uid(50)+".jpg";
            var path     = folder+"/"+name;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            await uploadFile.image(request.files.image.data, {width: 800, path: path});
        }
        var link = `${config.domain}/image/niceplace/${request.body.id}/${name}`;
        return response.json({url: link});
    },
    update: (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: 800, path:"upload/niceplace"}),
    delete: (request, response) => {
        var path = `upload/niceplace/${request.params.id}`;
        if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true });
        return controller.deleteHaveAImage(request, response, {name: "image", path:"upload/niceplace"});
    }
}