var Model       = require("./Select");
module.exports  = class Insert extends Model{
    constructor({table,primakey}){
        super({table,primakey});
    }
    async insert(data){// data=[{username:"username",..}] or {username: "username",...}
        var sql;
        if(Array.isArray(data)){
            var colum   = Object.keys(data[0]).reduce((res,val)=>{
                if(res&&val) return res+","+val;
                else if(!res&&val) return val;
            },"");
            var values  = data.reduce((res,obj)=>{
                res.push(Object.values(obj));
                return res;
            },[]);
            sql = `INSERT INTO ${this._table} (${colum}) VALUES ?`;
            return await this.querySuper({sql: sql, data: [values]});
        }else{
            sql = `INSERT INTO ${this._table} SET ?`;
            return await this.querySuper({sql: sql, data: data});
        }
    }
}