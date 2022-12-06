var fs          = require("fs");
var res         = require("./Response");
var Model       = require("./Model");
var {image}     = require("./Upload");
var {uid}       = require("uid");

module.exports  = class Controller{
    #model;
    constructor({table, primakey, model}){
        this.#model = model ? model : new Model({table,primakey});
    }
    index(request, response, colums=["*"]){
        this.#model.getAll({colums:colums, where: request.query})
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    view(request, response, colums=["*"]){
        this.#model.getSingle({colums:colums, where: request.params})
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    create(request, response){
        this.#model.insert(request.body)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    createHaveAImage(request, response,object={name:"image",width:800,path:"upload"}){
        if(request.files){
            var files       = request.files;
            var nameImage   = uid(50)+".jpeg";
            var path        = object.path + "/" + nameImage;
            request.body[object.name] = nameImage;
            image(files[object.name].data,{width: object.width, path:path});
        }
        this.#model.insert(request.body)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    update(request, response){
        this.#model.anyWhere(request.params).update(request.body)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    updateHaveAImage(request, response,object={name:"image", nameNew:"imageNew", width:800, path:"upload"}){
        if(request.files){
            var pathOld     = object.path + "/" + request.body[object.name];
            if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);

            var files       = request.files;
            var nameImage   = uid(50)+".jpeg";
            var path        = object.path + "/" + nameImage;
            request.body[object.name] = nameImage;
            image(files[object.nameNew].data, {width: object.width, path:path});
        }
        this.#model.anyWhere(request.params).update(request.body)
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    delete(request, response){
        this.#model.anyWhere(request.params).delete()
        .then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
    deleteHaveAImage(request, response,object={name:"image", path:"upload"}){
        this.#model.getSingle({colums:[object.name], where: request.params}).then(results=>{
            if(results[0]){
                var path = object.path + "/" + results[0][object.name];
                if (fs.existsSync(path)) fs.unlinkSync(path);
            }
            return this.#model.anyWhere(request.params).delete();
        }).then(results=>res.success(response,{data:results}))
        .catch(error=>res.error(response,{error:error}));
    }
}