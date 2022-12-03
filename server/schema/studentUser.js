const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "username": {type: Schema.Types.ObjectId, ref: 'student' },
    "password": {type: String},
    "identity": {type: String}
    
})
module.exports = mongoose.model("studentUser", userSchema);