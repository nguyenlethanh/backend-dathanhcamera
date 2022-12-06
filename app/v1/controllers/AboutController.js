var fs         = require("fs");
var res        = require("../../base/Response");
var AboutModel = require("../models/AboutModel");
var aboutModel = new AboutModel();
var {image}    = require("../../base/Upload");
var config     = require("../../../config.json");
var {uid}  = require("uid");

module.exports = {
    index:  (request, response) => {
        var columns = request.query.columns ? request.query.columns : ["*"];
        aboutModel.select(columns).anyWhere({id:1}).get().then(results=>res.success(response,{data: results}))
        .catch(error=>res.error(response,{error:error}));
    },
    update: (request, response) => {
        if(request.files){
            if(request.files.logoNew){
                var pathOld     =  "upload/" + request.body.logo;
                if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);

                var nameImage       = uid(50)+".jpeg";
                var path            = "upload/" + nameImage;
                request.body.logo   = nameImage;
                image(request.files.logoNew.data, {width: 250, path:path});
            }
            if(request.files.imageNew){
                var pathOld     =  "upload/" + request.body.image;
                if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);

                var nameImage       = uid(50)+".jpeg";
                var path            = "upload/" + nameImage;
                request.body.image   = nameImage;
                image(request.files.imageNew.data, {width: 800, path:path});
            }
        }
        aboutModel.anyWhere({id:1}).update(request.body).then(results=>res.success(response,{data: results}))
        .catch(error=>res.error(response,{error:error}));
    },
    uploadImage: async (request, response)=>{
        var folder = `upload/about`;
        if(request.files){
            var name    = uid(50)+".jpg";
            var path     = folder+"/"+name;
            await image(request.files.image.data, {width: null, path: path});
        }
        var link = request.protocol + '://' + request.get('host') + `/image/about/${name}`;
        return response.json({url: link});
    }
}