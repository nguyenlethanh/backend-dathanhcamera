var route       = require("express").Router();
var controller  = require("../../controllers/UsedCodeController");

route.get("/", controller.index);
route.post("/", controller.create);
route.post("/:id", controller.update);
route.get("/:id", controller.view);
route.delete("/:id", controller.delete);

module.exports = route;