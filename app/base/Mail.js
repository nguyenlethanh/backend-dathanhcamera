var mail    = require("nodemailer");
var gmail   =  mail.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'dathanhcamera@gmail.com',
        pass: 'mgwoihhlvexzdwht'
    }
});

function sendMail(mainOptions){
    return new Promise((resolve, reject)=>{
        gmail.sendMail(mainOptions, (err, info)=>{
            if (err) return reject({name: "sendMail", error:err});
            return resolve(info);
        });
    });
}
module.exports = sendMail;