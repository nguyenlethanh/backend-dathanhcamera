var Controller = require("../../base/Controller");
var controller = new Controller({table: "slide", primakey:"id"});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.createHaveAImage(request, response, {name: "image", width: null, path:"upload/slide"}),
    update: (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: null, path:"upload/slide"}),
    delete: (request, response) => controller.deleteHaveAImage(request, response, {name: "image", path:"upload/slide"})
}