const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
    origin: (origin,callback)=>{
      console.log(origin);
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('I dont know you so not allowing you.. - cors'));
        }
    },
    optionsSuccessStatus:200
}

module.exports = {corsOptions};