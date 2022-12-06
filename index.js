var config      = require("./config");
var express     = require("express");
var fs          = require("fs");
var path        = require("path");
var fileUpload  = require("express-fileupload");
var cors        = require("./cors");
var mysql       = require("mysql");
var db          = mysql.createConnection(config.db);

db.connect((error)=>{
    if(error) return console.log("error connect database!", error);
    global.DEBUG    = config.debug;
    global.DATABASE = db;
    var app         = express();
    if(config.debug){
        var morgan  = require("morgan");
        app.use(morgan("dev"));
    }
    app.use(cors);
    app.use(fileUpload());
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use("/image", express.static(path.join(__dirname, "./upload")));
    app.use(require("./app"));
    app.listen(config.server.port, ()=>console.log(`Server runing: http://localhost:${config.server.port}`));
});