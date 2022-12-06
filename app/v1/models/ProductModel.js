var Model = require("../../base/Model");

module.exports = class AboutModel extends Model{
    constructor(){
        super({table: "product", primakey: "id"});
    }
    whereSearch(data){
        var status = "";
        if(data.status) status = `product.status=${data.status}`;
        var category = "";
        if(data.category_id != 0) category = `(product.category_id="${data.category_id}" OR category.slug="${data.category_id}")`;
        var company = "";
        if(data.company_id != 0) company = `product.company_id=${data.company_id}`;
        var search = "";
        if(data.search) search = `product.name LIKE '%${data.search}%'`;
        return [status, category, company, search].reduce((res,val)=>{
            if(res && val) return res+" AND "+val;
            if(res) return res;
            if(val) return val;
        });
    }
    async search(data){
        var colums      = ["product.*","GROUP_CONCAT(image.name ORDER BY image.name ASC) AS images","company.image as company_image"];
        var where       = this.whereSearch(data);
        var count       = await this.select(["COUNT(product.id) AS count_row"]).leftJoin({table: "category", on: "category.id=product.category_id"}).whereRaw(where).get();
        var results     = [];
        var total_page  = 0;
        if(count[0].count_row > 0){
            results     = await this.select(colums)
            .leftJoin({table: "category", on: "category.id=product.category_id"})
            .leftJoin({table: "image", on: "product.id=image.product_id"})
            .leftJoin({table: "company", on: "company.id=product.company_id"})
            .whereRaw(where)
            .limit(data.size*(data.page -1), data.size)
            .groupBy("product.id")
            .orderBy([{colum: "id", sort: "DESC"}])
            .get();
            total_page  = Math.ceil(count[0].count_row/data.size);
        }
        return { results: results, page:data.page, size_page: data.size, total_page: total_page };
    }
}