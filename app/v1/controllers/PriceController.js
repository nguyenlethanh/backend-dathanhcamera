var Controller = require("../../base/Controller");
var controller = new Controller({table: "price", primakey:"id"});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => controller.create(request, response),
    update: (request, response) => controller.update(request, response),
    delete: (request, response) => controller.delete(request, response)
}