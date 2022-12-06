var sharp       = require("sharp");
module.exports  = {
    image: async (data,{width,path})=>{
        await sharp(data).metadata().then(async info=>{
            if(width==null) await sharp(data).resize().jpeg().toFile(path);
            else if(info.width > width) return await sharp(data).resize({ width: width }).jpeg().toFile(path);
            else await sharp(data).resize().jpeg().toFile(path);
        });
        return true;
    }
}