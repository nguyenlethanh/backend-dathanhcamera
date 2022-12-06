var Model = require("../../base/Model");

module.exports = class ImageModel extends Model{
    constructor(){
        super({table: "image", primakey: "id"});
    }
}