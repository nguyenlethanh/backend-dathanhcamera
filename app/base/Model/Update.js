var Model       = require("./Insert");
module.exports  = class Update extends Model{
    constructor({table,primakey}){
        super({table,primakey});
    }
    async update(data={}){
        var where = this._where ? `WHERE ${this._where}` : ""; 
        var sql   = `UPDATE ${this._table} SET ? ${where}`;
        this.clear();
        return await this.querySuper({sql: sql, data: data});
    }
}