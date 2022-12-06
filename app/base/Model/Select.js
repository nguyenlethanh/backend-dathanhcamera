var Model       = require("./Core");
var {debug}     = require("../../../config.json");

module.exports  = class Select extends Model{
    #select     = "*";
    #leftJoin   = "";
    _where      = "";
    #groupBy    = "";
    #having     = "";
    #orderby    = "";
    #limit      = "";
    constructor({table,primakey}){
        super({table,primakey});
    }
    clear(){
        this.#select     = "*";
        this.#leftJoin   = "";
        this._where      = "";
        this.#groupBy    = "";
        this.#having     = "";
        this.#orderby    = "";
        this.#limit      = "";
    }
    select(colums=["*"]){ //input: string or array
        if(Array.isArray(colums)) this.#select=colums.reduce((result,val)=>{
            if(val&&result) return result+`,${val}`;
            return result;
        });
        else this.#select = colums;
        return this;
    }
    leftJoin({table, on}){
        var leftJoin = [table,on].reduce((result,val)=>{
            if(val&&result) return result+` ON ${val}`;
            return result;
        });
        this.#leftJoin = this.#leftJoin + " LEFT JOIN " + leftJoin; 
        return this;
    }
    anyWhere(object={}){
        var where = [];
        for(var key in object) {
            var value = typeof object[key] == "string" ? `'${object[key]}'` : object[key];
            where.push(`${key}=${value}`);
        }
        this._where = where.reduce((res,val)=>{
            if(res&&val) return res+" AND "+val;
            else if(!res&&val) return val;
            return res;
        },"")
        return this;
    }
    where({colum,comparison,value}){
        if(typeof value == "string") value = `'${value}'`;
        else if(typeof value == "object") {
            value = value.reduce((result,val)=>{
                if(typeof val == "string") val = `'${val}'`;
                if(result&&val) return result+","+val;
                if(!result&&val) return val;
            },"");
            value = `(${value})`;
        }
        if(!comparison) comparison = " = ";
        else comparison = ` ${comparison} `;
        var where = [colum,comparison,value].reduce((result,val)=>{
            return result+val;
        });
        if(this._where) this._where = this._where + " AND " + where;
        else this._where = where;
        return this;
    }
    orWhere({colum,comparison,value}){
        if(typeof value == "string") value = `'${value}'`;
        else if(typeof value == "object") {
            value = value.reduce((result,val)=>{
                if(typeof val == "string") val = `'${val}'`;
                if(result&&val) return result+","+val;
                if(!result&&val) return val;
            },"");
            value = `(${value})`;
        }
        if(!comparison) comparison = " = ";
        else comparison = ` ${comparison} `;
        var where = [colum,comparison,value].reduce((result,val)=>{
            return result+val;
        });
        if(this._where) this._where = this._where + " OR " + where;
        else this._where = where;
        return this;
    }
    whereRaw(string){
        this._where = string;
        return this;
    }
    groupBy(colum){
        this.#groupBy = colum;
        return this;
    }
    having({colum,comparison,value}){
        if(typeof value == "string") value = `'${value}'`;
        if(!comparison) comparison="=";
        this.#having = [colum,comparison,value].reduce((result,val)=>{
            return result+val;
        });
        return this;
    }
    orderBy(arrange=[{colum: this._primakey, sort: "ASC"}]){
        this.#orderby = arrange.reduce((result, obj)=>{
            var string = `${obj.colum} ${obj.sort}`;
            if(result&&obj) return result+","+string;
            if(!result&&obj) return string;
        },"");
        return this;
    }
    limit(start,size=false){
        if(!size) this.#limit = start;
        else this.#limit = start+","+size;
        return this;
    }
    paginate({size,page}){
        var start = size*(page-1);
        return this.limit(start,size);
    }
    count({colum, as}){
        this.#select = `COUNT(${colum})`;
        if(as) this.#select += ` AS ${as}`;
        return this;
    }
    selectQueryString(){
        var sql     = `SELECT ${this.#select} FROM ${this._table}`;
        var leftJoin= this.#leftJoin;
        var where   = this._where ? ` WHERE ${this._where}` : "";
        var groupBy = this.#groupBy ? ` GROUP BY ${this.#groupBy}` : "";
        var having  = this.#having ? ` HAVING ${this.#having}` : "";
        var orderBy = this.#orderby ? ` ORDER BY ${this.#orderby}` : "";
        var limit   = this.#limit ? ` LIMIT ${this.#limit}` : "";
        return [sql,leftJoin,where,groupBy,having,orderBy,limit].reduce((result,value)=>{
            if(value) return result+value;
            return result;
        });
    }
    async get(){
        var sql = this.selectQueryString();
        if(debug) console.log(sql);
        this.clear();
        return await this.query({sql: sql});        
    }
}