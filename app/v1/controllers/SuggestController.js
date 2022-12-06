var res             = require("../../base/Response");
var Controller      = require("../../base/Controller");
var SuggestModel    = require("../models/SuggestModel");
var suggestModel    = new SuggestModel();
var controller      = new Controller({model: suggestModel});

module.exports = {
    index:  (request, response) => {

        suggestModel.select(["suggest.*","category.slug AS category_slug","product.name","product.price","product.slug","GROUP_CONCAT(image.name ORDER BY image.name ASC) AS images"])
        .leftJoin({table: "product", on: "suggest.suggest_product_id=product.id"})
        .leftJoin({table: "category", on: "category.id=product.category_id"})
        .leftJoin({table: "image", on: "image.product_id=product.id"})
        .anyWhere(request.query)
        .groupBy("id")
        .get().then(results=>res.success(response, {data:results}))
        .catch(error=>res.error(response,{error:error}));
    },
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.create(request, response),
    update: (request, response) => controller.update(request, response),
    delete: (request, response) => controller.delete(request, response)
}