var route       = require("express").Router();
var controller  = require("../../controllers/AuthController");
var {auth}      = require("../middleware");
var {register}      = require("./middleware");

route.post("/login", controller.login);
route.get("/forgot-password", controller.forgotPassword);
route.post("/change-password", controller.changePassword);
route.post("/register", register,controller.register);
route.post("/login-with-google", controller.loginWithGoogle);
route.get("/check", auth, controller.check);
route.get("/info", auth, controller.info);
route.get("/history", auth, controller.history);
route.get("/cart/:cart_id", auth,controller.cart);
route.delete("/cart/:id", auth,controller.deleteCart);

module.exports = route;