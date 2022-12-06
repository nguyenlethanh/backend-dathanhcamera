var Controller      = require("../../base/Controller");
var UsedCodeModel   = require("../models/UsedCodeModel");
var usedCodeModel   = new UsedCodeModel();
var controller      = new Controller({model:usedCodeModel});

module.exports = {
    index:  (request, response) => controller.index(request, response),
    view:   (request, response) => controller.view(request, response),
    create: (request, response) => ()=>{
        
    },
    update: (request, response) => controller.update(request, response),
    delete: (request, response) => controller.delete(request, response)
}