var Model = require("../../base/Model");

module.exports = class CartDetailModel extends Model{
    constructor(){
        super({table: "cart_detail", primakey: "id"});
    }
    async check({product_id, start, finish}={}){
        //var where = `product_id=${product_id} AND (finish < "${start}" OR start > "${finish}")`;
        var where = `cart.status=5 OR (cart_detail.product_id=${product_id} AND (
            (cart_detail.start < "${start}" AND cart_detail.finish > "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start < "${start}" AND cart_detail.finish >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.start <= "${finish}" AND cart_detail.finish > "${finish}")
        ) AND (cart.status=1 OR cart.status=2))`;
        return await this.select(["cart_detail.id"]).leftJoin({table: "cart", on: "cart_detail.cart_id=cart.id"}).whereRaw(where).get();
    }
    async rentList({start, finish}={}){
        //var where = `product_id=${product_id} AND (finish < "${start}" OR start > "${finish}")`;
        var where = `(
            (cart_detail.start < "${start}" AND cart_detail.finish > "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start < "${start}" AND cart_detail.finish >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.start <= "${finish}" AND cart_detail.finish > "${finish}")
        ) AND (cart.status=1 OR cart.status=2)`;
        return await this.select(["product.name AS product_name","cart_detail.*"])
        .leftJoin({table: "cart", on: "cart_detail.cart_id=cart.id"})
        .leftJoin({table: "product", on: "product.id=cart_detail.product_id"})
        .whereRaw(where)
        .get();
    }
    async checkUpdateStatus({cart_id,product_id, start, finish}={}){
        //var where = `product_id=${product_id} AND (finish < "${start}" OR start > "${finish}")`;
        var where = `cart.status=5 OR (cart_detail.cart_id!=${cart_id} AND cart_detail.product_id=${product_id} AND (
            (cart_detail.start < "${start}" AND cart_detail.finish > "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start < "${start}" AND cart_detail.finish >= "${start}" AND cart_detail.finish <= "${finish}") OR
            (cart_detail.start >= "${start}" AND cart_detail.start <= "${finish}" AND cart_detail.finish > "${finish}")
        ) AND (cart.status=1 OR cart.status=2))`;
        return await this.select(["cart_detail.id"]).leftJoin({table: "cart", on: "cart_detail.cart_id=cart.id"}).whereRaw(where).get();
    }
    async now(product_id){
        return await this.select(["cart_detail.*"])
        .leftJoin({table: "cart", on: "cart_detail.cart_id=cart.id"})
        .whereRaw(`(cart.status=1 OR cart.status=2) AND cart_detail.product_id = ${product_id} AND (cart_detail.start >= NOW() OR cart_detail.finish >= NOW())`)
        .get();
    }
    async revenue(data){
        var status  = data.status ? `cart.status=${data.status}` : "";
        var date    = `cart.date >= '${data.time_from}' AND cart.date <= '${data.time_to}'`;
        var where   = status ? `${status} AND ${date}` : date;
        var sql = `SELECT 
        DATE(cart.date) as day,
        SUM(cart_detail.cost) as revenue  
        FROM cart_detail LEFT JOIN cart ON cart_detail.cart_id = cart.id
        WHERE ${where} GROUP BY day`;
        return await this.query({sql: sql, functionName: "CartDetail.revenue"});
    }
}