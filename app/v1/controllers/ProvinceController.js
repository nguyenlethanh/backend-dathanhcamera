var Controller = require("../../base/Controller");
var controller = new Controller({table: "province", primakey:"id"});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.createHaveAImage(request, response, {name: "image", width: 800, path:"upload/province"}),
    update: (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: 800, path:"upload/province"}),
    delete: (request, response) => controller.deleteHaveAImage(request, response, {name: "image", path:"upload/province"})
}