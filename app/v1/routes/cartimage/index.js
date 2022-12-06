var route       = require("express").Router();
var controller  = require("../../controllers/CartImageController");

route.get("", controller.index);
route.post("", controller.create);
route.delete("/:id", controller.delete);

module.exports = route;