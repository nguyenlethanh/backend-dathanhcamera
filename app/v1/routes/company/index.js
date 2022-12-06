var route       = require("express").Router();
var controller  = require("../../controllers/CompanyController");

route.get("", controller.index);
route.get("/:id", controller.view);
route.post("", controller.create);
route.post("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;