var Model = require("../../base/Model");

module.exports = class CartImageModel extends Model{
    constructor(){
        super({table: "discount_code", primakey: "id"});
    }
    async getAllPaginate(data){
        return await this.select(["discount_code.*", "(SELECT COUNT(*) FROM used_code WHERE discount_code.id=used_code.discount_code_id) AS used"])
        .paginate({size: data.size, page: data.page})
        .get();
    }
    async checkUsedNumber(code){
        return await this.select(["discount_code.number", "(SELECT COUNT(*) FROM used_code WHERE discount_code.id=used_code.discount_code_id) AS used"])
        .where({colum: "code", value: code})
        .get();
    }
}