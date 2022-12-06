var Model = require("../../base/Model");

module.exports = class CartModel extends Model{
    constructor(){
        super({table: "cart", primakey: "id"});
    }
    async getCartByUserId(user_id){
        var colums = ["cart.id", "cart.date", "cart.status", "cart_detail.product_id", "product.name AS product_name", "cart_detail.start", "cart_detail.finish"];
        return await this.select(colums)
        .leftJoin({table: "cart_detail", on: "cart.id=cart_detail.cart_id"})
        .leftJoin({table: "product", on: "cart_detail.product_id=product.id"})
        .where({colum:"cart.user_id", value: user_id})
        .get();
    }
    async getCartByUserId2(data){
        var user = data.user_id ? `cart.user_id=${data.user_id}` : ``;
        var where= user ? `${user} AND cart.id=${data.cart_id}`: `cart.id=${data.cart_id}`;
        var sql = `SELECT
        cart.*,
        user.fullname,
        user.cmnd,
        user.address,
        user.phone,
        SUM(cart_detail.cost) AS cost,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', cart_detail.id,
                'product_id', cart_detail.product_id,
                'product_name', product.name,
                'product_price', product.price,
                'total', cart_detail.total,
                'start', cart_detail.start,
                'finish', cart_detail.finish,
                'cost', cart_detail.cost
            )
        ) AS list,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'code', discount_code.code,
                'value',discount_code.value,
                'type_discount_id', discount_code.type_discount_id
            )
        ) AS discount
        FROM cart 
        LEFT JOIN used_code ON cart.id = used_code.cart_id
        LEFT JOIN discount_code ON discount_code.id = used_code.discount_code_id
        LEFT JOIN cart_detail ON cart.id = cart_detail.cart_id
        LEFT JOIN product ON cart_detail.product_id = product.id
        LEFT JOIN user ON user.id = cart.user_id
        WHERE ${where} 
        GROUP BY id`;
        return await this.query({sql: sql, functionName: "CartModel.getCartByUserId2"});
    }
    async getCartByUserId3(data){
        var where   = data.status ? `cart.user_id="${data.user_id}" AND cart.status="${data.status}"` : `cart.user_id="${data.user_id}"`;
        var sql     = this.select(["COUNT(cart.id) AS count_row"]).whereRaw(where);
        var count   = await sql.get();
        if(count[0].count_row){
            var colums  = `cart.*,
            SUM(cart_detail.cost) AS cost,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', cart_detail.id,
                    'product_id', cart_detail.product_id,
                    'product_name', product.name,
                    'total', cart_detail.total,
                    'start', cart_detail.start,
                    'finish', cart_detail.finish,
                    'cost', cart_detail.cost
                )
            ) AS list,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'code', discount_code.code,
                    'value',discount_code.value,
                    'type_discount_id', discount_code.type_discount_id
                )
            ) AS discount`;
            var results = await sql.select(colums)
            .leftJoin({table: "cart_detail", on:"cart_detail.cart_id=cart.id"})
            .leftJoin({table: "used_code", on:"cart.id=used_code.cart_id"})
            .leftJoin({table: "discount_code", on:"discount_code.id=used_code.discount_code_id"})
            .leftJoin({table: "product", on: "product.id=cart_detail.product_id"})
            .whereRaw(where)
            .groupBy("id")
            .orderBy([{colum: "id", sort: "DESC"}])
            .paginate({size: data.size, page: data.page})
            .get();

            return {results: results, page: data.page, size_page: data.size, total_page: Math.ceil(count[0].count_row/data.size)};
        }else return {results: [], page: data.page, size_page: data.size, total_page: 0};
    }
    async getCart(){
        var sql = `SELECT
        cart.*,
        user.fullname,
        SUM(cart_detail.cost) AS cost,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', cart_detail.id,
                'product_id', cart_detail.product_id,
                'product_name', product.name,
                'start', cart_detail.start,
                'finish', cart_detail.finish,
                'cost', cart_detail.cost
            )
        ) AS list
        FROM cart 
        LEFT JOIN cart_detail ON cart.id = cart_detail.cart_id
        LEFT JOIN product ON cart_detail.product_id = product.id
        LEFT JOIN user ON cart.user_id = user.id
        GROUP BY id`;
        return await this.query({sql: sql, functionName: "CartModel.getCartByUserId2"});
    }
    async getCart2(data){
        var status  = data.status   ? `cart.status="${data.status}"` : "";
        var time    = data.time_to  ? `(DATE(cart.date) >= DATE("${data.time_from}") AND DATE(cart.date) <= DATE("${data.time_to}"))` : "";
        var where   = [status, time].reduce((res, val)=>{
            if(res && val) return res+" AND "+val;
            if(!res && val) return val;
            if(res && !val) return res;
            return "";
        });
        var sql     = this.select(["COUNT(cart.id) AS count_row"]).whereRaw(where);
        var count   = await sql.get();
        if(count[0].count_row){
            var colums  = `cart.*,
            user.fullname,
            user.email,
            SUM(cart_detail.cost) AS cost,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', cart_detail.id,
                    'product_id', cart_detail.product_id,
                    'product_name', product.name,
                    'total', cart_detail.total,
                    'start', cart_detail.start,
                    'finish', cart_detail.finish,
                    'cost', cart_detail.cost
                )
            ) AS list,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'code', discount_code.code,
                    'value',discount_code.value,
                    'type_discount_id', discount_code.type_discount_id
                )
            ) AS discount`;
            var results = await sql.select(colums)
            .leftJoin({table: "user", on:"user.id=cart.user_id"})
            .leftJoin({table: "used_code", on:"cart.id=used_code.cart_id"})
            .leftJoin({table: "discount_code", on:"discount_code.id=used_code.discount_code_id"})
            .leftJoin({table: "cart_detail", on:"cart_detail.cart_id=cart.id"})
            .leftJoin({table: "product", on: "product.id=cart_detail.product_id"})
            .whereRaw(where)
            .groupBy("id")
            .orderBy([{colum: "id", sort: data.orderBy}])
            .paginate({size: data.size, page: data.page})
            .get();

            return {results: results, page: data.page, size_page: data.size, total_page: Math.ceil(count[0].count_row/data.size)};
        }else return {results: [], page: data.page, size_page: data.size, total_page: 0};
    }
    async revenue(data){
        var status  = data.status ? `status=${data.status}` : "";
        var date    = `date >= '${data.time_from}' AND date <= '${data.time_to}'`;
        var where   = status ? `${status} AND ${date}` : date;
        var sql = `SELECT 
        DATE(date) as day,
        SUM(expense) as revenue
        FROM cart 
        WHERE ${where} GROUP BY day`;
        return await this.query({sql: sql, functionName: "Cart.revenue"});
    }
    async monthRevenue(month, search=""){
        var sql = `
        SELECT 
            COUNT(cd.product_id) AS total_product,
            SUM(cd.total) AS total_day,
            SUM(cd.cost) AS total_cost,
            p.name AS product_name
        FROM cart_detail AS cd
        LEFT JOIN product AS p ON cd.product_id=p.id
        LEFT JOIN cart AS c ON cd.cart_id=c.id 
        WHERE p.name LIKE "%${search}%" AND MONTH(cd.finish)=? AND YEAR(cd.finish)=YEAR(NOW()) AND c.status >=1
        GROUP BY cd.product_id
        ORDER BY total_cost DESC`;

        return await this.querySuper({sql: sql, data:[ month], functionName: "monthRevenue"});
    }
}