var fs      = require("fs");

var config;
if(!fs.existsSync("./config.json")){
    config = fs.readFileSync("./config.base.json",{encoding:"utf8"});
    fs.writeFileSync("./config.json", config, {encoding:"utf8"});
}else config = fs.readFileSync("./config.json",{encoding:"utf8"});

module.exports = JSON.parse(config);