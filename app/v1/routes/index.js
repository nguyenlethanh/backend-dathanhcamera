var route = require("express").Router();

route.get("", (request, response)=>{
    return response.json({
        status: 200,
        message: "welcome api v1!"
    })
});
route.use("/about", require("./about"));
route.use("/slide", require("./slide"));
route.use("/category", require("./category"));
route.use("/company", require("./company"));
route.use("/province", require("./province"));
route.use("/nice-place", require("./niceplace"));
route.use("/product", require("./product"));
route.use("/image", require("./image"));
route.use("/price", require("./price"));
route.use("/suggest", require("./suggest"));
route.use("/auth", require("./auth"));
route.use("/user", require("./user"));
route.use("/cart", require("./cart"));
route.use("/cart-detail", require("./cartdetail"));
route.use("/cart-image", require("./cartimage"));
route.use("/revenue", require("./revenue"));
route.use("/discount", require("./discount"));

module.exports = route;