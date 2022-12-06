var Model       = require("./Delete");
module.exports  = class Index extends Model{
    constructor({table,primakey}){
        super({table,primakey});
    }
    async getAll({colums,where}){
        return await this.select(colums).anyWhere(where).get();
    }
    async getSingle({colums,where}){
        return await this.select(colums).anyWhere(where).get();
    }
}