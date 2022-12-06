var Model = require("../../base/Model");

module.exports = class AboutModel extends Model{
    constructor(){
        super({table: "about", primakey: "id"});
    }
}