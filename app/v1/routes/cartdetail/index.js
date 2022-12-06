var route       = require("express").Router();
var controller  = require("../../controllers/CartDetailController");

route.get("/", controller.index);
route.get("/now", controller.now);
route.get("/rent-list", controller.rentList);
route.get("/:id", controller.view);
route.post("/", controller.create);
route.post("/check", controller.check);
route.post("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;