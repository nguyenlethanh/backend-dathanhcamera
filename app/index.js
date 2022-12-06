var route = require("express").Router();

route.get("/", (request, response)=>{
    return response.json({
        status: 200,
        message: "Welcome!"
    });
});
route.use("/v1", require("./v1/routes"));

module.exports = route;