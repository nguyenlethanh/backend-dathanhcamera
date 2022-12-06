var route       = require("express").Router();
var controller  = require("../../controllers/RevenueController");

route.get("/", controller.index);
route.get("/cart-detail", controller.index2);

module.exports = route;