var route       = require("express").Router();
var controller  = require("../../controllers/UserController");
var {auth}          = require("../middleware");

route.get("", controller.index);
route.get("/:id", controller.view);
route.post("", auth, controller.edit);
route.post("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;