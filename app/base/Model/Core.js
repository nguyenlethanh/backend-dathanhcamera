module.exports = class Core{
    _table;
    _primakey;
    constructor({table, primakey}){
        this._table     = table;
        this._primakey  = primakey;
    }
    query({sql,functionName=""}={}){
        return new Promise((resolve,reject)=>{
            DATABASE.query(sql, (error, results, fields)=>{
                if(!error) return resolve(results);
                return reject({error:error, functionName: functionName});
            });
        });
    }
    querySuper({sql, data , functionName=""}={}){
        return new Promise((resolve,reject)=>{
            DATABASE.query(sql, data, (error, results, fields)=>{
                if(!error) return resolve(results);
                return reject({error:error, functionName: functionName});
            });
        });
    }
}