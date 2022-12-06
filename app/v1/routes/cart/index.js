var route       = require("express").Router();
var controller  = require("../../controllers/CartController");

route.get("/", controller.index);
route.get("/update-status/:id", controller.updateStatus);
route.get("/month-revenue/:month", controller.monthRevenue);
route.get("/:id", controller.view);
route.post("/", controller.create);
route.post("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;