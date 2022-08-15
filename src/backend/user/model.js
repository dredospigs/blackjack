const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {type:String, required:true},
        matches: {type:Number, required:true},
        wins: {type:Number, required:true},
        achievments : {type:Array, required:true}
    },
    {
        versionKey:false
    }
);

module.exports = mongoose.models.users || mongoose.model("users", userSchema)