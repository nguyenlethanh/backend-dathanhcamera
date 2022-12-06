var Model = require("../../base/Model");

module.exports = class AboutModel extends Model{
    constructor(){
        super({table: "nice_place", primakey: "id"});
    }
    whereSearch(data){
        var status = "";
        if(data.status) status = `status=${data.status}`;
        var province = "";
        if(data.province_id != 0) province = `province_id=${data.province_id}`;
        var search = "";
        if(data.search) search = `(name LIKE '%${data.search}%' OR address LIKE '%${data.search}%')`;
        return [status, province, search].reduce((res,val)=>{
            if(res && val) return res+" AND "+val;
            if(res) return res;
            if(val) return val;
        });
    }
    async search(data){
        var colums      = ["*"];
        var where       = this.whereSearch(data);
        var count       = await this.select(["COUNT(id) AS count_row"]).whereRaw(where).get();
        var results     = [];
        var total_page  = 0;
        if(count[0].count_row > 0){
            results     = await this.select(colums).whereRaw(where).limit(data.size*(data.page -1), data.size).orderBy([{colum: "id", sort: "DESC"}]).get();
            total_page  = Math.ceil(count[0].count_row/data.size);
        }
        return { results: results, total_page: total_page };
    }
}