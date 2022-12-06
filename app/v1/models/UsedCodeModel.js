var Model = require("../../base/Model");

module.exports = class UsedCodeModel extends Model{
    constructor(){
        super({table:"used_code", primakey:"id"});
    }
}