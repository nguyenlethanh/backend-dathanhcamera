var Controller = require("../../base/Controller");
var controller = new Controller({table: "category", primakey:"id"});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.createHaveAImage(request, response, {name: "image", width: 500, path:"upload/category"}),
    update: (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: 500, path:"upload/category"}),
    delete: (request, response) => controller.deleteHaveAImage(request, response, {name: "image", path:"upload/category"})
}