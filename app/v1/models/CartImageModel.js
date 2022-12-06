var Model = require("../../base/Model");

module.exports = class CartImageModel extends Model{
    constructor(){
        super({table: "cart_image", primakey: "id"});
    }
}