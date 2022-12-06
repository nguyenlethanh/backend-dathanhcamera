var Model = require("../../base/Model");

module.exports = class AboutModel extends Model{
    constructor(){
        super({table: "user", primakey: "id"});
    }
    async getInfoByGoogleId(google_id){
        return await this.select(["*"]).where({colum: "google_id", value: google_id}).get();
    }
    async getInfo(user_id){
        return await this.select(["*"]).where({colum: "id", value: user_id}).get();
    }
    async getUsersPaginate(data){
        var where   = data.status ? `status=${data.status}` : "";
        var count   = await this.select(["COUNT(id) AS count_row"]).whereRaw(where).get();
        var results = [];

        if(count[0].count_row) results = await this.select().whereRaw(where).paginate({size: data.size, page: data.page}).get();

        return {results: results, page: data.page, size_page: data.size, total_page: Math.ceil(count[0].count_row/data.size)};
    }
}