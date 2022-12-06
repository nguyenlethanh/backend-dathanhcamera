var route       = require("express").Router();
var controller  = require("../../controllers/ProductController");

route.get("", controller.index);
route.get("/:id", controller.view);
route.post("", controller.create);
route.post("/image", controller.uploadImage);
route.post("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;