var Model       = require("./Update");
module.exports  = class Delete extends Model{
    constructor({table,primakey}){
        super({table,primakey});
    }
    async delete(){
        var where = this._where ? `WHERE ${this._where}` : ""; 
        var sql   = `DELETE FROM ${this._table} ${where}`;
        this.clear();
        return await this.query({sql: sql});
    }
}