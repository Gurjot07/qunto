const mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minLength:1
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
    },
    country:{
        type:String,
        default:""
    },
    interest:{
        type:String,
        default:""  },
    bio:{
        type:String,
        default:""
    },
    skills:{
        type:Array,
        default:[]
    },
    imageurl:{
        type:String,
        default:"/images/default.png"
    },
    website:{
        type:String,
        default:"http://yourwebsite.com"
    },

});

let userSchemaModel = module.exports = mongoose.model('users',userSchema);