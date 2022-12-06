var route       = require("express").Router();
var controller  = require("../../controllers/DiscountCodeController");
var {auth}          = require("../middleware");

route.get("/", controller.index);
route.get("/check", auth,controller.check);
route.post("/", controller.create);
route.post("/:id", controller.update);
route.get("/:id", controller.view);
route.delete("/:id", controller.delete);

module.exports = route;