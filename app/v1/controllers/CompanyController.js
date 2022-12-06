var Controller = require("../../base/Controller");
var controller = new Controller({table: "company", primakey:"id"});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.createHaveAImage(request, response, {name: "image", width: 300, path:"upload/company"}),
    update: (request, response) => controller.updateHaveAImage(request, response, {name: "image", nameNew:"imageNew", width: 300, path:"upload/company"}),
    delete: (request, response) => controller.deleteHaveAImage(request, response, {name: "image", path:"upload/company"})
}