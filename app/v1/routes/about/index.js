var route       = require("express").Router();
var controller  = require("../../controllers/AboutController");
var {auth}      = require("../middleware");

route.get("/", controller.index);
route.post("/", auth, controller.update);
route.post("/image", controller.uploadImage);

module.exports = route;