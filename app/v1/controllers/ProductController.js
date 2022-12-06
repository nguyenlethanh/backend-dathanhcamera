var res             = require("../../base/Response");
var Controller      = require("../../base/Controller");
var ProductModel  = require("../models/ProductModel");
var productModel  = new ProductModel(); 
var controller      = new Controller({model: productModel});
var uploadFile      = require("../../base/Upload");
var {uid}       = require("uid");
var config          = require("../../../config.json");
var fs              = require("fs");

module.exports      = {
    index:  (request, response) => {
        var data = {
            status: request.query.status ? request.query.status : request.query.status == 0 ? 0 : false,
            category_id: request.query.category_id ?  request.query.category_id : false,
            company_id: request.query.company_id ?  request.query.company_id : false,
            search: request.query.search ? request.query.search : false,
            page: request.query.page ? request.query.page : 1,
            size: request.query.size ? request.query.size : 20
        };
        productModel.search(data)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    view:   (request, response) => {
        var columns = ["product.*","GROUP_CONCAT(image.name ORDER BY image.name ASC) AS images", "company.image as company_image"]
        productModel.select(columns)
        .leftJoin({table: "image", on: "product.id = image.product_id"})
        .leftJoin({table: "company", on: "company.id = product.company_id"})
        .where({colum:"product.id", comparison: "=", value: request.params.id})
        .orWhere({colum:"product.slug", comparison: "=", value: request.params.id})
        .groupBy("id")
        .get().then(results=>res.success(response, {data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    create: (request, response) => {
        productModel.insert({name:""})
        .then(result=>res.success(response,{data:result}))
        .catch(error=>res.error(response,{error: error}));
    },
    uploadImage: async (request, response)=>{
        var folder = `upload/product/${request.body.id}`;
        if(request.files){
            var name    = uid(50)+".jpg";
            var path     = folder+"/"+name;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            await uploadFile.image(request.files.image.data, {width: 800, path: path});
        }
        var link = `${config.domain}/image/product/${request.body.id}/${name}`;
        return response.json({url: link});
    },
    update: (request, response) => controller.update(request, response),
    delete: (request, response) => {
        var path = `upload/niceplace/${request.params.id}`;
        if (fs.existsSync(path)) fs.rmdirSync(path, { recursive: true });
        return controller.delete(request, response);
    }
}